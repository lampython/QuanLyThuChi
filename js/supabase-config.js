/**
 * SmartFinance Pro - Supabase Cloud Client & Realtime Sync
 * Cấu hình kết nối Supabase, Đăng nhập Google và Phân quyền RBAC
 */

const SUPABASE_URL = "https://mfucbmiwvcuhzkzbnryl.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1mdWNibWl3dmN1aHpremJucnlsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODY4Nzg3MjAsImV4cCI6MjEwMjQ1NDcyMH0.W_xM1FAL5ceM6amIQQRJy1wzgatzM9m8uzNg-erIiKk";

const getSupabaseClient = () => {
    if (window.supabase && typeof window.supabase.createClient === 'function') {
        return window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
            auth: {
                persistSession: true,
                autoRefreshToken: true,
                detectSessionInUrl: true,
                storage: window.localStorage
            }
        });
    }
    return null;
};

const SupabaseService = {
    _client: null,
    get client() {
        if (!this._client) {
            this._client = getSupabaseClient();
        }
        return this._client;
    },
    set client(c) {
        this._client = c;
    },
    currentUser: null,
    currentProfile: null,
    currentWorkspace: null,
    currentRole: 'owner', // 'owner' | 'admin' | 'contributor' | 'viewer'
    workspaces: [],
    realtimeSubscription: null,

    /**
     * Khởi tạo trạng thái xác thực và người dùng (Ghi nhớ vĩnh viễn trên mọi thiết bị - Hỗ trợ Offline 0ms)
     */
    async initAuth(onStateChangeCallback) {
        const client = this.client;

        // Nếu thiết bị đang ngoại tuyến (!navigator.onLine): Phục hồi ngay lập tức từ Cache cục bộ trong 0ms
        const savedUserId = localStorage.getItem('sothuchi_logged_user_id');
        const savedEmail = localStorage.getItem('sothuchi_logged_user_email');
        if (savedUserId && (!navigator.onLine || !client)) {
            this.currentUser = { id: savedUserId, email: savedEmail };
            await this.loadWorkspaces();
            if (typeof onStateChangeCallback === 'function') {
                onStateChangeCallback(this.currentUser, this.currentRole, this.currentWorkspace);
            }
            return this.currentUser;
        }

        if (!client) {
            console.warn('Supabase JS library not loaded');
            if (typeof onStateChangeCallback === 'function') onStateChangeCallback(null);
            return null;
        }

        try {
            // Giới hạn thời gian getSession tối đa 1.5 giây để chống treo mạng
            let session = null;
            try {
                const sessionRes = await Promise.race([
                    client.auth.getSession(),
                    new Promise((_, reject) => setTimeout(() => reject(new Error('timeout')), 1500))
                ]);
                session = sessionRes?.data?.session;
            } catch (e) {
                console.warn('getSession timeout, phục hồi cache offline');
            }

            if (session?.user) {
                this.currentUser = session.user;
                localStorage.setItem('sothuchi_logged_user_id', session.user.id);
                localStorage.setItem('sothuchi_logged_user_email', session.user.email || '');
                await this.fetchProfile();
                await this.loadWorkspaces();
                if (typeof onStateChangeCallback === 'function') {
                    onStateChangeCallback(this.currentUser, this.currentRole, this.currentWorkspace);
                }
            } else if (savedUserId) {
                // Fallback nếu session hết hạn khi offline: Giữ phiên đăng nhập
                this.currentUser = { id: savedUserId, email: savedEmail };
                await this.loadWorkspaces();
                if (typeof onStateChangeCallback === 'function') {
                    onStateChangeCallback(this.currentUser, this.currentRole, this.currentWorkspace);
                }
            } else {
                if (typeof onStateChangeCallback === 'function') {
                    onStateChangeCallback(null);
                }
            }

            // 2. Lắng nghe sự kiện auth realtime khi có mạng
            client.auth.onAuthStateChange(async (event, newSession) => {
                if (event === 'SIGNED_IN' || (event === 'TOKEN_REFRESHED' && newSession?.user)) {
                    if (!this.currentUser || this.currentUser.id !== newSession?.user?.id) {
                        this.currentUser = newSession.user;
                        localStorage.setItem('sothuchi_logged_user_id', this.currentUser.id);
                        localStorage.setItem('sothuchi_logged_user_email', this.currentUser.email || '');
                        await this.fetchProfile();
                        await this.loadWorkspaces();
                        if (typeof onStateChangeCallback === 'function') {
                            onStateChangeCallback(this.currentUser, this.currentRole, this.currentWorkspace);
                        }
                    }
                } else if (event === 'SIGNED_OUT') {
                    this.currentUser = null;
                    this.currentProfile = null;
                    this.currentWorkspace = null;
                    this.currentRole = 'owner';
                    this.workspaces = [];
                    localStorage.removeItem('sothuchi_logged_user_id');
                    localStorage.removeItem('sothuchi_logged_user_email');
                    localStorage.removeItem('smartfinance_active_ws_id');
                    localStorage.removeItem('sothuchi_cached_workspaces');
                    localStorage.removeItem('sothuchi_cached_current_workspace');
                    if (typeof onStateChangeCallback === 'function') {
                        onStateChangeCallback(null);
                    }
                }
            });

            return this.currentUser;
        } catch (e) {
            console.error('Error initializing Supabase Auth:', e);
            if (savedUserId) {
                this.currentUser = { id: savedUserId, email: savedEmail };
                await this.loadWorkspaces();
                if (typeof onStateChangeCallback === 'function') onStateChangeCallback(this.currentUser, this.currentRole, this.currentWorkspace);
                return this.currentUser;
            }
            if (typeof onStateChangeCallback === 'function') onStateChangeCallback(null);
            return null;
        }
    },

    /**
     * Đăng nhập bằng tài khoản Google
     */
    async loginWithGoogle() {
        if (!this.client) return;
        
        // Luôn chuyển hướng về domain chính thức https://sothuchi-cuaban.netlify.app
        let redirectTo = 'https://sothuchi-cuaban.netlify.app';
        if (window.location.protocol.startsWith('http') && !window.location.hostname.includes('localhost')) {
            redirectTo = window.location.origin + window.location.pathname;
        }

        const { error } = await this.client.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: redirectTo
            }
        });
        if (error) {
            console.error('Google login error:', error.message);
            throw error;
        }
    },

    /**
     * Chuẩn hóa mật khẩu (cho phép mật khẩu ngắn từ 4 ký tự mà Supabase vẫn chấp nhận)
     */
    normalizePassword(password) {
        if (!password) return '';
        return password.length < 6 ? `${password}__auth` : password;
    },

    /**
     * Đăng nhập bằng Email và Mật Khẩu
     */
    async loginWithEmail(email, password) {
        if (!this.client) throw new Error('Supabase client chưa tải');
        const formattedPassword = this.normalizePassword(password);
        
        const { data, error } = await this.client.auth.signInWithPassword({
            email: email.trim(),
            password: formattedPassword
        });

        if (error) {
            console.error('Email login error:', error.message);
            throw error;
        }

        this.currentUser = data.user;
        try {
            localStorage.setItem('sothuchi_logged_user_id', data.user.id);
            localStorage.setItem('sothuchi_logged_user_email', data.user.email || '');
        } catch (e) {}
        await this.fetchProfile();
        await this.loadWorkspaces();
        return this.currentUser;
    },

    /**
     * Đăng ký tài khoản mới bằng Email và Mật Khẩu
     */
    async signupWithEmail(email, password) {
        if (!this.client) throw new Error('Supabase client chưa tải');
        const formattedPassword = this.normalizePassword(password);
        const namePart = email.split('@')[0] || 'Người dùng';

        const { data, error } = await this.client.auth.signUp({
            email: email.trim(),
            password: formattedPassword,
            options: {
                data: {
                    full_name: namePart,
                    name: namePart
                }
            }
        });

        if (error) {
            console.error('Email signup error:', error.message);
            throw error;
        }

        // Tự động đăng nhập và tải sổ cho người dùng ngay sau khi tạo
        try {
            const user = await this.loginWithEmail(email, password);
            return user;
        } catch (e) {
            if (data.user) {
                this.currentUser = data.user;
                await this.fetchProfile();
                await this.loadWorkspaces();
            }
            return data.user;
        }
    },

    /**
     * Gửi yêu cầu đặt lại mật khẩu qua Email
     */
    async resetPasswordForEmail(email) {
        if (!this.client) throw new Error('Supabase client chưa tải');
        let redirectTo = 'https://sothuchi-cuaban.netlify.app';
        if (window.location.protocol.startsWith('http') && !window.location.hostname.includes('localhost')) {
            redirectTo = window.location.origin + window.location.pathname;
        }

        const { data, error } = await this.client.auth.resetPasswordForEmail(email.trim(), {
            redirectTo: redirectTo
        });

        if (error) {
            console.error('resetPassword error:', error.message);
            throw error;
        }
        return data;
    },

    /**
     * Cập nhật mật khẩu mới cho tài khoản
     */
    async updateUserPassword(newPassword) {
        if (!this.client) throw new Error('Supabase client chưa tải');
        const formattedPassword = this.normalizePassword(newPassword);
        const { data, error } = await this.client.auth.updateUser({
            password: formattedPassword
        });
        if (error) throw error;
        return data;
    },

    /**
     * Đăng xuất tài khoản
     */
    async logout() {
        if (!this.client) return;
        if (this.realtimeSubscription) {
            this.client.removeChannel(this.realtimeSubscription);
            this.realtimeSubscription = null;
        }
        await this.client.auth.signOut();
        this.currentUser = null;
        this.currentProfile = null;
        this.currentWorkspace = null;
        this.workspaces = [];
    },

    /**
     * Lấy hoặc tạo thông tin Profile người dùng
     */
    async fetchProfile() {
        if (!this.currentUser) return null;
        try {
            const { data, error } = await this.client
                .from('profiles')
                .select('*')
                .eq('id', this.currentUser.id)
                .single();

            if (data) {
                this.currentProfile = data;
            } else {
                // Fallback nếu trigger chưa chạy kịp
                const newProfile = {
                    id: this.currentUser.id,
                    email: this.currentUser.email,
                    full_name: this.currentUser.user_metadata?.full_name || this.currentUser.user_metadata?.name || this.currentUser.email,
                    avatar_url: this.currentUser.user_metadata?.avatar_url || ''
                };
                await this.client.from('profiles').upsert(newProfile);
                this.currentProfile = newProfile;
            }
            return this.currentProfile;
        } catch (e) {
            console.error('fetchProfile error:', e);
            return null;
        }
    },

    /**
     * Tải danh sách các Workspace (Sổ thu chi) mà người dùng sở hữu hoặc tham gia
     */
    async loadWorkspaces() {
        if (!this.currentUser) return [];

        try {
            // 1. Lấy sổ người dùng sở hữu (Owner)
            const { data: ownedList, error: ownedErr } = await this.client
                .from('workspaces')
                .select('*')
                .eq('owner_id', this.currentUser.id)
                .order('created_at', { ascending: true });

            // 2. Lấy sổ người dùng được mời (bao gồm theo email hoặc user_id)
            const userEmail = (this.currentUser.email || '').toLowerCase().trim();
            const { data: memberList, error: memberErr } = await this.client
                .from('workspace_members')
                .select('id, workspace_id, role, status, user_id, user_email, workspaces(*)')
                .or(`user_email.eq.${userEmail},user_id.eq.${this.currentUser.id}`);

            // Tự động kích hoạt các bản ghi pending / thiếu user_id để đồng bộ tức thì
            if (memberList && memberList.length > 0) {
                const needsUpdate = memberList.filter(m => m.status === 'pending' || !m.user_id);
                if (needsUpdate.length > 0) {
                    const ids = needsUpdate.map(m => m.id);
                    try {
                        await this.client
                            .from('workspace_members')
                            .update({ status: 'accepted', user_id: this.currentUser.id })
                            .in('id', ids);
                    } catch (e) {}
                }
            }

            const allWorkspaces = [];

            // Nếu người dùng mới chưa có sổ nào -> Tự động tạo 1 Sổ Home mặc định
            if ((!ownedList || ownedList.length === 0) && (!memberList || memberList.length === 0)) {
                const { data: createdWs } = await this.client
                    .from('workspaces')
                    .insert({
                        name: 'Home',
                        owner_id: this.currentUser.id
                    })
                    .select()
                    .single();

                if (createdWs) {
                    allWorkspaces.push({ ...createdWs, userRole: 'owner' });
                }
            } else {
                if (ownedList) {
                    ownedList.forEach(w => allWorkspaces.push({ ...w, userRole: 'owner' }));
                }
                if (memberList) {
                    memberList.forEach(m => {
                        if (m.workspaces && !allWorkspaces.some(w => w.id === m.workspaces.id)) {
                            allWorkspaces.push({ ...m.workspaces, userRole: m.role, isShared: true });
                        }
                    });
                }
            }

            this.workspaces = allWorkspaces;

            // Tự động khôi phục sổ active đã chọn gần nhất hoặc ưu tiên Sổ Gia Đình
            const savedWsId = localStorage.getItem('smartfinance_active_ws_id');
            if (savedWsId && this.workspaces.some(w => w.id === savedWsId)) {
                this.currentWorkspace = this.workspaces.find(w => w.id === savedWsId);
            } else {
                const familyWs = this.workspaces.find(w => w.name.includes('Quỹ Gia Đình') || w.name.includes('Gia Đình') || w.id === 'e8a6d808-d633-47bb-872d-4ba8da78647e');
                this.currentWorkspace = familyWs || this.workspaces[0] || null;
                if (this.currentWorkspace) {
                    try { localStorage.setItem('smartfinance_active_ws_id', this.currentWorkspace.id); } catch (e) {}
                }
            }

            // Lưu cache cục bộ để chạy offline
            try {
                localStorage.setItem('sothuchi_cached_workspaces', JSON.stringify(this.workspaces));
                if (this.currentWorkspace) {
                    localStorage.setItem('sothuchi_cached_current_workspace', JSON.stringify(this.currentWorkspace));
                }
            } catch (e) {}

            // Xác định quyền hạn hiện tại
            this.updateCurrentRole();
            return this.workspaces;
        } catch (e) {
            console.warn('loadWorkspaces network error, phục hồi từ cache offline:', e.message);
            try {
                const cachedWs = localStorage.getItem('sothuchi_cached_workspaces');
                if (cachedWs) {
                    this.workspaces = JSON.parse(cachedWs);
                    const cachedCur = localStorage.getItem('sothuchi_cached_current_workspace');
                    this.currentWorkspace = cachedCur ? JSON.parse(cachedCur) : (this.workspaces[0] || null);
                    this.updateCurrentRole();
                    return this.workspaces;
                }
            } catch (err) {}
            return [];
        }
    },

    /**
     * Đổi sang Workspace (Sổ thu chi) khác
     */
    switchWorkspace(workspaceId) {
        const found = this.workspaces.find(w => w.id === workspaceId);
        if (found) {
            this.currentWorkspace = found;
            this.updateCurrentRole();
            try {
                localStorage.setItem('smartfinance_active_ws_id', workspaceId);
            } catch (e) {}
            return true;
        }
        return false;
    },

    /**
     * Tạo Workspace (Sổ thu chi) mới
     */
    async createWorkspace(name) {
        if (!this.currentUser || !name.trim()) return null;
        const { data, error } = await this.client
            .from('workspaces')
            .insert({
                name: name.trim(),
                owner_id: this.currentUser.id
            })
            .select()
            .single();

        if (error) {
            console.error('createWorkspace error:', error.message);
            throw error;
        }

        await this.loadWorkspaces();
        this.currentWorkspace = this.workspaces.find(w => w.id === data.id) || this.workspaces[0];
        this.updateCurrentRole();
        return data;
    },

    /**
     * Đổi tên Workspace (Sổ thu chi) hiện tại
     */
    async renameWorkspace(workspaceId, newName) {
        if (!this.client || !newName.trim()) return null;
        const targetWs = this.workspaces.find(w => w.id === workspaceId);
        if (targetWs && targetWs.owner_id !== this.currentUser?.id) {
            throw new Error('Chỉ Chủ sở hữu (Owner) của sổ mới có quyền đổi tên!');
        }

        const { data, error } = await this.client
            .from('workspaces')
            .update({ name: newName.trim() })
            .eq('id', workspaceId)
            .select()
            .single();

        if (error) {
            console.error('renameWorkspace error:', error.message);
            throw error;
        }

        await this.loadWorkspaces();
        if (this.currentWorkspace && this.currentWorkspace.id === workspaceId) {
            this.currentWorkspace.name = newName.trim();
        }
        return data;
    },

    /**
     * Xóa Workspace (Chỉ Owner mới có quyền xóa)
     */
    async deleteWorkspace(workspaceId) {
        if (!this.client || !this.currentUser) return false;
        
        const ownedWorkspaces = this.workspaces.filter(w => w.owner_id === this.currentUser.id);
        if (ownedWorkspaces.length <= 1) {
            throw new Error('Bạn không thể xóa Sổ duy nhất còn lại của mình!');
        }

        const targetWs = this.workspaces.find(w => w.id === workspaceId);
        if (!targetWs || targetWs.owner_id !== this.currentUser.id) {
            throw new Error('Bạn chỉ có thể xóa Sổ do chính mình làm Chủ sở hữu!');
        }

        // Xóa các bảng con trước
        await this.client.from('transactions').delete().eq('workspace_id', workspaceId);
        await this.client.from('workspace_members').delete().eq('workspace_id', workspaceId);
        await this.client.from('activity_logs').delete().eq('workspace_id', workspaceId);

        const { error } = await this.client
            .from('workspaces')
            .delete()
            .eq('id', workspaceId);

        if (error) throw error;

        await this.loadWorkspaces();
        return true;
    },

    /**
     * Rời khỏi Workspace được chia sẻ
     */
    async leaveWorkspace(workspaceId) {
        if (!this.client || !this.currentUser) return false;

        const userEmail = (this.currentUser.email || '').toLowerCase().trim();
        const { error } = await this.client
            .from('workspace_members')
            .delete()
            .eq('workspace_id', workspaceId)
            .or(`user_id.eq.${this.currentUser.id},user_email.eq.${userEmail}`);

        if (error) throw error;

        await this.loadWorkspaces();
        return true;
    },

    /**
     * Lấy danh sách lời mời đang chờ xác nhận (Pending Invitations)
     */
    async fetchPendingInvitations() {
        if (!this.client || !this.currentUser) return [];
        try {
            const userEmail = (this.currentUser.email || '').toLowerCase().trim();
            const { data, error } = await this.client
                .from('workspace_members')
                .select('id, workspace_id, role, status, created_at, workspaces(id, name, owner_id)')
                .eq('status', 'pending')
                .eq('user_email', userEmail);

            if (error) {
                console.error('fetchPendingInvitations error:', error);
                return [];
            }
            return data || [];
        } catch (e) {
            console.error('fetchPendingInvitations error:', e);
            return [];
        }
    },

    /**
     * Chấp nhận lời mời tham gia Sổ
     */
    async acceptInvitation(invitationId) {
        if (!this.client || !this.currentUser) return;
        const { data, error } = await this.client
            .from('workspace_members')
            .update({
                status: 'accepted',
                user_id: this.currentUser.id
            })
            .eq('id', invitationId)
            .select()
            .single();

        if (error) throw error;
        await this.loadWorkspaces();
        if (data && data.workspace_id) {
            this.switchWorkspace(data.workspace_id);
        }
        return data;
    },

    /**
     * Từ chối lời mời tham gia Sổ
     */
    async rejectInvitation(invitationId) {
        if (!this.client) return;
        const { error } = await this.client
            .from('workspace_members')
            .delete()
            .eq('id', invitationId);

        if (error) throw error;
        return true;
    },

    /**
     * Cập nhật vai trò hiện tại trong Workspace đang chọn
     */
    updateCurrentRole() {
        if (!this.currentWorkspace || !this.currentUser) {
            this.currentRole = 'owner';
            return;
        }
        if (this.currentWorkspace.owner_id === this.currentUser.id) {
            this.currentRole = 'owner';
        } else {
            this.currentRole = this.currentWorkspace.userRole || 'contributor';
        }
    },

    // ==================== QUẢN LÝ THÀNH VIÊN (DÀNH CHO OWNER) ====================
    async getWorkspaceMembers(workspaceId) {
        if (!this.client || !workspaceId) return [];
        const { data, error } = await this.client
            .from('workspace_members')
            .select('*, profiles(full_name, avatar_url)')
            .eq('workspace_id', workspaceId);

        if (error) {
            console.error('getWorkspaceMembers error:', error);
            return [];
        }
        return data || [];
    },

    async fetchMembers(workspaceId = null) {
        const wsId = workspaceId || this.currentWorkspace?.id;
        return this.getWorkspaceMembers(wsId);
    },

    async inviteMember(workspaceId, email, role = 'contributor') {
        if (!this.client || (this.currentRole !== 'owner' && this.currentRole !== 'admin')) {
            throw new Error('Chỉ Chủ sở hữu (Owner) hoặc Quản trị viên (Admin) mới có quyền mời thành viên');
        }

        const cleanEmail = email.trim().toLowerCase();

        // Kiểm tra xem user này đã có profile chưa
        let targetUserId = null;
        try {
            const { data: profile } = await this.client
                .from('profiles')
                .select('id')
                .eq('email', cleanEmail)
                .single();
            if (profile) targetUserId = profile.id;
        } catch (e) {}

        const { data, error } = await this.client
            .from('workspace_members')
            .upsert({
                workspace_id: workspaceId,
                user_email: cleanEmail,
                user_id: targetUserId,
                role: role,
                status: 'accepted'
            }, {
                onConflict: 'workspace_id,user_email'
            })
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    async removeMember(memberId) {
        if (!this.client || (this.currentRole !== 'owner' && this.currentRole !== 'admin')) {
            throw new Error('Chỉ Chủ sở hữu (Owner) hoặc Quản trị viên (Admin) mới có quyền xóa thành viên');
        }
        const { error } = await this.client
            .from('workspace_members')
            .delete()
            .eq('id', memberId);

        if (error) throw error;
        return true;
    },

    async updateMemberRole(memberId, newRole) {
        if (!this.client || this.currentRole !== 'owner') {
            throw new Error('Chỉ Owner mới có quyền thay đổi vai trò thành viên');
        }
        const { data, error } = await this.client
            .from('workspace_members')
            .update({ role: newRole })
            .eq('id', memberId)
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    async fetchAuditLogs(workspaceId = null) {
        const wsId = workspaceId || this.currentWorkspace?.id;
        return this.getActivityLogs(wsId);
    },

    // ==================== TRANSACTIONS CRUD (OFFLINE-FIRST + SUPABASE SYNC) ====================
    async getTransactions(workspaceId) {
        const wsId = workspaceId || this.currentWorkspace?.id || localStorage.getItem('smartfinance_active_ws_id');
        if (!wsId) return [];
        const cacheKey = 'sothuchi_cached_txs_' + wsId;

        // 1. Nếu ngoại tuyến (!navigator.onLine): Trả về ngay lập tức từ Cache trong 0ms!
        if (!navigator.onLine) {
            try {
                const cached = localStorage.getItem(cacheKey);
                if (cached) return JSON.parse(cached);
            } catch (e) {}
        }

        if (!this.client) {
            try {
                const cached = localStorage.getItem(cacheKey);
                if (cached) return JSON.parse(cached);
            } catch (e) {}
            return [];
        }

        // 2. Nếu trực tuyến: Tải từ Supabase với timeout 2.5s để chống treo
        try {
            const fetchPromise = this.client
                .from('transactions')
                .select('*')
                .eq('workspace_id', wsId)
                .order('date', { ascending: false });

            const timeoutPromise = new Promise((_, reject) => setTimeout(() => reject(new Error('timeout')), 2500));
            const { data, error } = await Promise.race([fetchPromise, timeoutPromise]);

            if (error) throw error;
            const mapped = (data || []).map(t => ({
                ...t,
                categoryId: t.category_id || t.categoryId,
                sub_items: Array.isArray(t.sub_items) ? t.sub_items : [],
                sync_status: 'synced',
                local_timestamp: new Date(t.created_at || t.date).getTime()
            }));

            // ==================== YẾU TỐ THỜI GIAN THEO CHỈ ĐẠO CỦA SẾP ====================
            // 1. Đọc kho cục bộ hiện tại trên thiết bị
            let localVault = [];
            try {
                localVault = JSON.parse(localStorage.getItem(cacheKey) || '[]');
            } catch (e) {}

            const lastSyncTs = parseInt(localStorage.getItem('sothuchi_last_sync_ts_' + wsId) || '0', 10);

            // 2. Nhận diện chính xác các giao dịch ĐANG OFFLINE CHUẨN BỊ LÊN:
            const pendingOfflineTxs = localVault.filter(t => 
                t.sync_status === 'pending' || 
                t._isOffline === true || 
                (t.local_timestamp && t.local_timestamp > lastSyncTs) ||
                (typeof t.id === 'string' && t.id.startsWith('tx_offline_'))
            );

            // 3. Hợp nhất: Đưa các giao dịch offline lên trên cùng để không bao giờ bị Cloud đè mất!
            const mergedList = [...pendingOfflineTxs];
            mapped.forEach(cloudTx => {
                const isAlreadyPresent = mergedList.some(localTx => 
                    localTx.id === cloudTx.id || 
                    (localTx.sync_status === 'pending' && localTx.note === cloudTx.note && Number(localTx.amount) === Number(cloudTx.amount) && Math.abs(new Date(localTx.date) - new Date(cloudTx.date)) < 120000)
                );
                if (!isAlreadyPresent) {
                    mergedList.push(cloudTx);
                }
            });

            mergedList.sort((a, b) => new Date(b.date) - new Date(a.date));

            // Lưu kho an toàn
            try {
                localStorage.setItem(cacheKey, JSON.stringify(mergedList));
                localStorage.setItem('sothuchi_last_sync_ts_' + wsId, String(Date.now()));
            } catch (e) {}

            return mergedList;
        } catch (error) {
            console.warn('getTransactions fallback to cache:', error.message);
            try {
                const cached = localStorage.getItem(cacheKey);
                if (cached) return JSON.parse(cached);
            } catch (e) {}
            return [];
        }
    },

    async addTransaction(tx) {
        const wsId = this.currentWorkspace?.id || localStorage.getItem('smartfinance_active_ws_id') || 'default_ws';
        const cacheKey = 'sothuchi_cached_txs_' + wsId;

        const catId = tx.category_id || tx.categoryId || (typeof Utils !== 'undefined' && Utils.predictCategory ? Utils.predictCategory(tx.note, tx.type)?.categoryId : null) || (tx.type === 'income' ? 'cat_income_other' : 'cat_food');

        const dateIso = tx.date 
            ? (tx.date.includes('Z') || (tx.date.includes('+') && tx.date.length > 18) ? tx.date : (typeof Utils !== 'undefined' && Utils.toIsoString ? Utils.toIsoString(tx.date) : new Date(tx.date).toISOString()))
            : new Date().toISOString();

        const subItemsList = Array.isArray(tx.sub_items) ? tx.sub_items : (Array.isArray(tx.subItems) ? tx.subItems : []);
        const localTimestamp = Date.now();

        // Đóng dấu mốc thời gian và cờ offline theo chỉ đạo của Sếp
        const localTx = {
            id: tx.id && !tx.id.startsWith('tx_offline_') ? tx.id : ('tx_offline_' + localTimestamp + '_' + Math.random().toString(36).substr(2, 5)),
            workspace_id: wsId,
            created_by: this.currentUser ? this.currentUser.id : null,
            type: tx.type,
            amount: Number(tx.amount),
            note: tx.note,
            date: dateIso,
            category_id: catId,
            categoryId: catId,
            sub_items: subItemsList,
            local_timestamp: localTimestamp, // MỐC THỜI GIAN CHÍNH XÁC
            sync_status: 'pending',          // ĐANG OFFLINE CHUẨN BỊ LÊN
            _isOffline: true
        };

        // 1. Lưu ngay vào Cache cục bộ để giao diện cập nhật tức thì (0ms)
        try {
            let cached = JSON.parse(localStorage.getItem(cacheKey) || '[]');
            const existingIdx = cached.findIndex(t => t.id === localTx.id);
            if (existingIdx >= 0) cached[existingIdx] = localTx;
            else cached.unshift(localTx);
            localStorage.setItem(cacheKey, JSON.stringify(cached));
        } catch (e) {}

        // 2. Nếu có mạng và Supabase sẵn sàng -> Đẩy lên đám mây
        if (navigator.onLine && this.client && this.currentWorkspace) {
            try {
                const insertPromise = this.client
                    .from('transactions')
                    .insert({
                        workspace_id: this.currentWorkspace.id,
                        created_by: this.currentUser ? this.currentUser.id : null,
                        type: tx.type,
                        amount: Number(tx.amount),
                        note: tx.note,
                        date: dateIso,
                        category_id: catId,
                        sub_items: subItemsList
                    })
                    .select()
                    .single();

                const timeoutPromise = new Promise((_, reject) => setTimeout(() => reject(new Error('timeout')), 3000));
                const { data, error } = await Promise.race([insertPromise, timeoutPromise]);

                if (!error && data) {
                    const syncedTx = {
                        ...data,
                        categoryId: data.category_id,
                        sub_items: subItemsList,
                        local_timestamp: localTimestamp,
                        sync_status: 'synced',
                        _isOffline: false
                    };
                    // Cập nhật lại ID từ Supabase vào cache
                    try {
                        let cached = JSON.parse(localStorage.getItem(cacheKey) || '[]');
                        cached = cached.map(t => (t.id === localTx.id || t.local_timestamp === localTimestamp) ? syncedTx : t);
                        localStorage.setItem(cacheKey, JSON.stringify(cached));
                        localStorage.setItem('sothuchi_last_sync_ts_' + wsId, String(Date.now()));
                    } catch (e) {}
                    return syncedTx;
                }
            } catch (netErr) {
                console.warn('Lưu Cloud timeout/error, đã giữ an toàn mốc thời gian offline:', netErr.message);
            }
        }

        // 3. Nếu chưa lưu được lên Cloud -> Giữ nguyên trạng thái pending để tự động đồng bộ khi có mạng
        try {
            let pending = JSON.parse(localStorage.getItem('sothuchi_pending_sync_txs') || '[]');
            pending.push({ action: 'insert', tx: localTx });
            localStorage.setItem('sothuchi_pending_sync_txs', JSON.stringify(pending));
        } catch (e) {}

        return localTx;
    },

    async updateTransaction(id, tx) {
        if (!this.client) return null;

        // Chỉ Owner và Admin được phép sửa
        if (this.currentRole !== 'owner' && this.currentRole !== 'admin') {
            throw new Error('Chỉ Owner hoặc Admin mới có quyền chỉnh sửa giao dịch');
        }

        const catId = tx.category_id || tx.categoryId || (typeof Utils !== 'undefined' && Utils.predictCategory ? Utils.predictCategory(tx.note, tx.type)?.categoryId : null);
        const dateIso = tx.date 
            ? (tx.date.includes('Z') || (tx.date.includes('+') && tx.date.length > 18) ? tx.date : (typeof Utils !== 'undefined' && Utils.toIsoString ? Utils.toIsoString(tx.date) : new Date(tx.date).toISOString()))
            : new Date().toISOString();

        const subItemsList = Array.isArray(tx.sub_items) ? tx.sub_items : (Array.isArray(tx.subItems) ? tx.subItems : []);

        const { data, error } = await this.client
            .from('transactions')
            .update({
                type: tx.type,
                amount: Number(tx.amount),
                note: tx.note,
                date: dateIso,
                category_id: catId,
                sub_items: subItemsList
            })
            .eq('id', id)
            .select()
            .single();

        if (error) {
            console.error('updateTransaction error:', error);
            throw error;
        }
        return {
            ...data,
            categoryId: data.category_id,
            sub_items: Array.isArray(data.sub_items) ? data.sub_items : []
        };
    },

    async deleteTransaction(id, reason = '') {
        if (!this.client) return false;

        // Chỉ Owner và Admin được phép xóa
        if (this.currentRole !== 'owner' && this.currentRole !== 'admin') {
            throw new Error('Chỉ Owner hoặc Admin mới có quyền xóa giao dịch');
        }

        // Lấy thông tin giao dịch trước khi xóa để ghi log
        const { data: oldTx } = await this.client
            .from('transactions')
            .select('*')
            .eq('id', id)
            .single();

        const { error } = await this.client
            .from('transactions')
            .delete()
            .eq('id', id);

        if (error) {
            console.error('deleteTransaction error:', error);
            throw error;
        }

        if (oldTx) {
            const typeStr = oldTx.type === 'income' ? 'Khoản Thu' : 'Khoản Chi';
            const amtStr = Number(oldTx.amount).toLocaleString('vi-VN') + ' ₫';
            await this.addActivityLog(
                oldTx.workspace_id,
                'DELETE_TX',
                `Đã xóa ${typeStr}: ${amtStr} - Nội dung: "${oldTx.note}"`,
                reason || 'Không ghi lý do'
            );
        }

        return true;
    },

    // ==================== ACTIVITY & AUDIT LOGS ====================
    async addActivityLog(workspaceId, action, details, reason = null) {
        if (!this.client || !workspaceId) return;
        try {
            const userEmail = this.currentUser ? this.currentUser.email : 'Khách vãng lai';
            const userId = this.currentUser ? this.currentUser.id : null;

            await this.client.from('activity_logs').insert({
                workspace_id: workspaceId,
                user_id: userId,
                user_email: userEmail,
                action: action,
                details: details,
                reason: reason
            });
        } catch (e) {
            console.error('addActivityLog error:', e);
        }
    },

    async getActivityLogs(workspaceId) {
        if (!this.client || !workspaceId) return [];
        try {
            const { data, error } = await this.client
                .from('activity_logs')
                .select('*')
                .eq('workspace_id', workspaceId)
                .order('created_at', { ascending: false });

            if (error) throw error;
            return data || [];
        } catch (e) {
            console.error('getActivityLogs error:', e);
            return [];
        }
    },

    /**
     * Đăng ký Realtime đồng bộ tức thời khi có thay đổi dữ liệu
     */
    subscribeRealtime(workspaceId, onDataChanged) {
        if (!this.client || !workspaceId) return;

        if (this.realtimeSubscription) {
            this.client.removeChannel(this.realtimeSubscription);
        }

        this.realtimeSubscription = this.client
            .channel(`workspace-${workspaceId}`)
            .on(
                'postgres_changes',
                {
                    event: '*',
                    schema: 'public',
                    table: 'transactions',
                    filter: `workspace_id=eq.${workspaceId}`
                },
                (payload) => {
                    console.log('Realtime change received:', payload);
                    if (typeof onDataChanged === 'function') {
                        onDataChanged(payload);
                    }
                }
            )
            .subscribe();
    }
};

window.SupabaseService = SupabaseService;
