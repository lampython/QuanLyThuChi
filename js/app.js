/**
 * Sổ Thu Chi - JavaScript Main Controller (Chuẩn Mockup 100%)
 */

document.addEventListener('DOMContentLoaded', async () => {
    AppData.init();

    const State = {
        period: 'today',
        startDate: '',
        endDate: '',
        type: 'all',
        keyword: '',
        currentPage: 1,
        rowsPerPage: 10,
        mobileVisibleCount: 10,
        onlineMode: false,
        userRole: 'owner',
        transactions: [],
        logs: []
    };

    // Header Elements
    const todayDateText = document.getElementById('todayDateText');
    if (todayDateText) {
        todayDateText.textContent = Utils.getTodayFullVietnamese();
    }

    const btnSettingsToggle = document.getElementById('btnSettingsToggle');
    const settingsMenuPopup = document.getElementById('settingsMenuPopup');
    const btnOpenAuthModal = document.getElementById('btnOpenAuthModal');
    const userProfilePillWrap = document.getElementById('userProfilePillWrap');
    const userDisplayName = document.getElementById('userDisplayName');
    const userDisplayNameMenu = document.getElementById('userDisplayNameMenu');
    const headerAvatarImg = document.getElementById('headerAvatarImg');
    const headerDefaultUserIcon = document.getElementById('headerDefaultUserIcon');
    const userAvatarImg = document.getElementById('userAvatarImg');
    const menuDefaultUserIcon = document.getElementById('menuDefaultUserIcon');
    const userRoleBadge = document.getElementById('userRoleBadge');
    const btnLogout = document.getElementById('btnLogout');
    const menuWsGroup = document.getElementById('menuWsGroup');
    const workspaceSelect = document.getElementById('workspaceSelect');
    const btnOpenCreateWsModal = document.getElementById('btnOpenCreateWsModal');
    const btnOpenMembersModal = document.getElementById('btnOpenMembersModal');
    const btnOpenLogsModal = document.getElementById('btnOpenLogsModal');

    // Summary Card Elements
    const totalBalanceVal = document.getElementById('totalBalanceVal');
    const subOpeningBalance = document.getElementById('subOpeningBalance');
    const mobileOpeningBalanceTag = document.getElementById('mobileOpeningBalanceTag');
    const subTotalIncome = document.getElementById('subTotalIncome');
    const subTotalExpense = document.getElementById('subTotalExpense');
    const totalIncomeVal = document.getElementById('totalIncomeVal');
    const totalExpenseVal = document.getElementById('totalExpenseVal');
    const incomeCountLabel = document.getElementById('incomeCountLabel');
    const expenseCountLabel = document.getElementById('expenseCountLabel');
    const openIncomeModalBtn = document.getElementById('openIncomeModalBtn');
    const openExpenseModalBtn = document.getElementById('openExpenseModalBtn');

    // Table Elements
    const tableTxCount = document.getElementById('tableTxCount');
    const txTableBody = document.getElementById('txTableBody');
    const emptyDataState = document.getElementById('emptyDataState');
    const actionHeaderCol = document.getElementById('actionHeaderCol');
    const searchInput = document.getElementById('searchInput');
    const typeFilter = document.getElementById('typeFilter');
    const periodFilter = document.getElementById('periodFilter');
    const customDateInputs = document.getElementById('customDateInputs');
    const filterStartDate = document.getElementById('filterStartDate');
    const filterEndDate = document.getElementById('filterEndDate');
    const btnExportCsv = document.getElementById('btnExportCsv');
    const btnOpenReports = document.getElementById('btnOpenReports');

    // Pagination Elements
    const paginationSummaryText = document.getElementById('paginationSummaryText');
    const btnPrevPage = document.getElementById('btnPrevPage');
    const btnNextPage = document.getElementById('btnNextPage');
    const currentPageNumber = document.getElementById('currentPageNumber');
    const rowsPerPageSelect = document.getElementById('rowsPerPageSelect');

    // Modals
    const txModal = document.getElementById('txModal');
    const txForm = document.getElementById('txForm');
    const modalTitle = document.getElementById('modalTitle');
    const txId = document.getElementById('txId');
    const txType = document.getElementById('txType');
    const txAmount = document.getElementById('txAmount');
    const txCategory = document.getElementById('txCategory');
    const txNote = document.getElementById('txNote');
    const txDate = document.getElementById('txDate');
    const closeModalBtn = document.getElementById('closeModalBtn');
    const btnCancelModal = document.getElementById('btnCancelModal');

    const authModal = document.getElementById('authModal');
    const closeAuthModalBtn = document.getElementById('closeAuthModalBtn');
    const btnGoogleLogin = document.getElementById('btnGoogleLogin');
    const emailAuthForm = document.getElementById('emailAuthForm');
    const tabModeLogin = document.getElementById('tabModeLogin');
    const tabModeSignup = document.getElementById('tabModeSignup');
    const authEmailInput = document.getElementById('authEmailInput');
    const authPasswordInput = document.getElementById('authPasswordInput');
    const btnTogglePassword = document.getElementById('btnTogglePassword');
    const pwdEyeIcon = document.getElementById('pwdEyeIcon');
    const btnAuthSubmit = document.getElementById('btnAuthSubmit');
    const btnAuthSubmitText = document.getElementById('btnAuthSubmitText');

    // Set Default Dates
    const now = new Date();
    const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().slice(0, 10);
    const todayStr = now.toISOString().slice(0, 10);
    if (filterStartDate) filterStartDate.value = firstDayOfMonth;
    if (filterEndDate) filterEndDate.value = todayStr;
    State.startDate = firstDayOfMonth;
    State.endDate = todayStr;

    // ==================== SETTINGS MENU TOGGLE ====================
    btnSettingsToggle?.addEventListener('click', (e) => {
        e.stopPropagation();
        settingsMenuPopup?.classList.toggle('active');
    });

    document.addEventListener('click', (e) => {
        if (!settingsMenuPopup?.contains(e.target) && e.target !== btnSettingsToggle) {
            settingsMenuPopup?.classList.remove('active');
        }
    });

    // ==================== WORKSPACE & INVITATIONS ELEMENTS ====================
    const btnWsSelectorToggle = document.getElementById('btnWsSelectorToggle');
    const wsDropdownMenu = document.getElementById('wsDropdownMenu');
    const currentWsIcon = document.getElementById('currentWsIcon');
    const currentWsName = document.getElementById('currentWsName');
    const currentWsRoleBadge = document.getElementById('currentWsRoleBadge');
    const wsListContainer = document.getElementById('wsListContainer');
    const btnOpenRenameWsModal = document.getElementById('btnOpenRenameWsModal');
    const btnOpenCreateWsHeaderModal = document.getElementById('btnOpenCreateWsHeaderModal');
    const renameWsModal = document.getElementById('renameWsModal');
    const renameWsForm = document.getElementById('renameWsForm');
    const renameWsInput = document.getElementById('renameWsInput');
    const closeRenameWsModalBtn = document.getElementById('closeRenameWsModalBtn');
    const btnCancelRenameWs = document.getElementById('btnCancelRenameWs');

    // Notifications Elements
    const btnNotifBell = document.getElementById('btnNotifBell');
    const notifBadge = document.getElementById('notifBadge');
    const notifDropdownPopup = document.getElementById('notifDropdownPopup');
    const notifItemsList = document.getElementById('notifItemsList');
    const invitationAlertBanner = document.getElementById('invitationAlertBanner');
    const invAlertText = document.getElementById('invAlertText');
    const invAlertActions = document.getElementById('invAlertActions');

    // ==================== WORKSPACE DROPDOWN TOGGLE ====================
    btnWsSelectorToggle?.addEventListener('click', (e) => {
        e.stopPropagation();
        wsDropdownMenu?.classList.toggle('active');
        settingsMenuPopup?.classList.remove('active');
        notifDropdownPopup?.classList.remove('active');
    });

    btnNotifBell?.addEventListener('click', (e) => {
        e.stopPropagation();
        notifDropdownPopup?.classList.toggle('active');
        wsDropdownMenu?.classList.remove('active');
        settingsMenuPopup?.classList.remove('active');
    });

    document.addEventListener('click', (e) => {
        if (!wsDropdownMenu?.contains(e.target) && e.target !== btnWsSelectorToggle) {
            wsDropdownMenu?.classList.remove('active');
        }
        if (!notifDropdownPopup?.contains(e.target) && e.target !== btnNotifBell) {
            notifDropdownPopup?.classList.remove('active');
        }
    });

    // ==================== SUPABASE AUTH INTEGRATION ====================
    async function onAuthStateChanged(user, role, activeWs) {
        if (user) {
            State.onlineMode = true;
            if (guestMenuHeader) guestMenuHeader.style.display = 'none';
            if (loggedMenuHeader) loggedMenuHeader.style.display = 'flex';
            if (btnOpenAuthModal) btnOpenAuthModal.style.display = 'none';
            if (logoutDivider) logoutDivider.style.display = 'block';
            if (btnLogout) btnLogout.style.display = 'flex';

            const meta = user.user_metadata || {};
            const displayName = SupabaseService.currentProfile?.full_name || meta.full_name || meta.name || user.email;
            const avatarUrl = SupabaseService.currentProfile?.avatar_url || meta.avatar_url;

            if (userDisplayName) userDisplayName.textContent = displayName;
            if (userDisplayNameMenu) userDisplayNameMenu.textContent = displayName;
            if (btnSettingsToggle) btnSettingsToggle.title = `Tài khoản: ${displayName} (${user.email || ''}) - Nhấp để xem menu quản lý`;

            if (avatarUrl) {
                if (headerAvatarImg) {
                    headerAvatarImg.src = avatarUrl;
                    headerAvatarImg.style.display = 'block';
                }
                if (headerDefaultUserIcon) headerDefaultUserIcon.style.display = 'none';
                if (userAvatarImg) {
                    userAvatarImg.src = avatarUrl;
                    userAvatarImg.style.display = 'block';
                }
                if (menuDefaultUserIcon) menuDefaultUserIcon.style.display = 'none';
            } else {
                if (headerAvatarImg) headerAvatarImg.style.display = 'none';
                if (headerDefaultUserIcon) headerDefaultUserIcon.style.display = 'block';
                if (userAvatarImg) userAvatarImg.style.display = 'none';
                if (menuDefaultUserIcon) menuDefaultUserIcon.style.display = 'block';
            }

            renderHeaderWorkspaceSelector();
            await checkPendingInvitations();
            await loadTransactionsData();
        } else {
            State.onlineMode = false;
            if (userDisplayName) userDisplayName.textContent = 'Đăng Nhập';
            if (btnSettingsToggle) btnSettingsToggle.title = 'Chưa đăng nhập (Chế độ nháp) - Nhấp để đăng nhập / đăng ký';
            if (guestMenuHeader) guestMenuHeader.style.display = 'flex';
            if (loggedMenuHeader) loggedMenuHeader.style.display = 'none';
            if (btnOpenAuthModal) btnOpenAuthModal.style.display = 'flex';
            if (logoutDivider) logoutDivider.style.display = 'none';
            if (btnLogout) btnLogout.style.display = 'none';

            if (headerAvatarImg) headerAvatarImg.style.display = 'none';
            if (headerDefaultUserIcon) headerDefaultUserIcon.style.display = 'block';

            if (currentWsName) currentWsName.textContent = 'Home (Mặc định)';
            if (currentWsRoleBadge) currentWsRoleBadge.textContent = '👑 Owner';
            if (notifBadge) notifBadge.style.display = 'none';
            if (invitationAlertBanner) invitationAlertBanner.style.display = 'none';

            State.userRole = 'owner';
            loadDraftTransactions();
        }
    }

    // 1. Phục hồi ngay lập tức từ Cache để người dùng thấy giao diện & số liệu trong 0ms (kể cả khi mất mạng)
    const activeWsId = localStorage.getItem('smartfinance_active_ws_id');
    const cachedTxsRaw = activeWsId ? localStorage.getItem('sothuchi_cached_txs_' + activeWsId) : null;
    if (cachedTxsRaw) {
        try {
            State.transactions = JSON.parse(cachedTxsRaw);
            State.onlineMode = true;
            render();
        } catch (e) {
            loadDraftTransactions();
        }
    } else {
        loadDraftTransactions();
    }

    // 2. Chạy initAuth bất đồng bộ trong nền, KHÔNG BAO GIỜ chặn luồng đăng ký Event Listener!
    const authService = window.SupabaseService || (typeof SupabaseService !== 'undefined' ? SupabaseService : null);
    if (authService) {
        authService.initAuth(onAuthStateChanged).catch(err => {
            console.warn('initAuth background error:', err);
        });
    }

    function renderHeaderWorkspaceSelector() {
        if (!SupabaseService.workspaces || SupabaseService.workspaces.length === 0) {
            if (currentWsName) currentWsName.textContent = 'Home';
            return;
        }

        const activeWs = SupabaseService.currentWorkspace || SupabaseService.workspaces[0];
        const isOwner = activeWs.owner_id === SupabaseService.currentUser?.id;
        if (currentWsName) currentWsName.textContent = activeWs.name;
        if (currentWsIcon) currentWsIcon.textContent = activeWs.name.toLowerCase().includes('home') ? '🏠' : (isOwner ? '📁' : '👥');

        // Phân loại: Sổ của bạn (Owned) & Sổ được chia sẻ (Shared)
        const ownedList = SupabaseService.workspaces.filter(w => w.owner_id === SupabaseService.currentUser?.id);
        const sharedList = SupabaseService.workspaces.filter(w => w.owner_id !== SupabaseService.currentUser?.id);

        if (wsListContainer) {
            let html = '';

            // 1. Nhóm Sổ Sở Hữu
            html += `
                <div class="ws-group-header">
                    <i class="fa-solid fa-folder"></i> SỔ CỦA BẠN (SỞ HỮU)
                </div>
                <div class="ws-group-list">
            `;
            if (ownedList.length > 0) {
                html += ownedList.map(w => {
                    const isSelected = w.id === activeWs.id;
                    const icon = w.name.toLowerCase().includes('home') ? '🏠' : '📁';
                    return `
                        <button class="ws-item-btn ${isSelected ? 'active' : ''}" onclick="handleSwitchWorkspace('${w.id}')">
                            <div class="ws-item-left">
                                <span>${icon}</span>
                                <span class="ws-item-title">${w.name}</span>
                            </div>
                            <span class="ws-item-badge ws-badge-owner">👑 Owner</span>
                        </button>
                    `;
                }).join('');
            } else {
                html += `<div style="font-size:11.5px; color:var(--text-muted); padding:4px 8px;">Chưa có sổ sở hữu nào.</div>`;
            }
            html += `</div>`;

            // 2. Nhóm Sổ Được Chia Sẻ
            if (sharedList.length > 0) {
                html += `
                    <div class="ws-group-header" style="margin-top:6px;">
                        <i class="fa-solid fa-users"></i> SỔ ĐƯỢC CHIA SẺ VỚI BẠN
                    </div>
                    <div class="ws-group-list">
                `;
                html += sharedList.map(w => {
                    const isSelected = w.id === activeWs.id;
                    const roleClass = w.userRole === 'admin' ? 'ws-badge-admin' : (w.userRole === 'contributor' ? 'ws-badge-contributor' : 'ws-badge-viewer');
                    const roleText = w.userRole === 'admin' ? '⭐ Admin' : (w.userRole === 'contributor' ? '✍️ Ghi chép' : '👁️ Xem');
                    return `
                        <button class="ws-item-btn ${isSelected ? 'active' : ''}" onclick="handleSwitchWorkspace('${w.id}')">
                            <div class="ws-item-left">
                                <span>👥</span>
                                <span class="ws-item-title">${w.name}</span>
                            </div>
                            <span class="ws-item-badge ${roleClass}">${roleText}</span>
                        </button>
                    `;
                }).join('');
                html += `</div>`;
            }

            wsListContainer.innerHTML = html;
        }

        // 3. Render Các Hành Động Dưới Cùng (Context-Aware Action Items)
        const wsMenuActions = document.getElementById('wsMenuActions');
        if (wsMenuActions) {
            let actionsHtml = '';

            if (isOwner) {
                // Là Chủ Sở Hữu: Được Đổi tên, Quản lý thành viên, Xóa sổ (nếu có > 1 sổ sở hữu)
                actionsHtml += `
                    <button class="btn-ws-action-item" onclick="openRenameWsModal()">
                        <i class="fa-solid fa-pen-to-square"></i>
                        <span>Đổi tên sổ</span>
                    </button>
                    <button class="btn-ws-action-item" onclick="openMembersFromWs()">
                        <i class="fa-solid fa-users"></i>
                        <span>Thành viên & Chia sẻ</span>
                    </button>
                `;
                if (ownedList.length > 1) {
                    actionsHtml += `
                        <button class="btn-ws-action-item text-danger" onclick="handleDeleteCurrentWs('${activeWs.id}', '${activeWs.name}')">
                            <i class="fa-solid fa-trash-can"></i>
                            <span>Xóa sổ này</span>
                        </button>
                    `;
                }
            } else {
                // Là Thành Viên Được Chia Sẻ: Có nút Rời Khỏi Sổ
                actionsHtml += `
                    <button class="btn-ws-action-item text-warning" onclick="handleLeaveCurrentWs('${activeWs.id}', '${activeWs.name}')">
                        <i class="fa-solid fa-arrow-right-from-bracket"></i>
                        <span>Rời khỏi sổ</span>
                    </button>
                `;
            }

            // Nút Tạo Thêm Sổ Mới luôn có
            actionsHtml += `
                <button class="btn-ws-action-item text-primary" onclick="openCreateWsModal()">
                    <i class="fa-solid fa-plus-circle"></i>
                    <span>+ Tạo sổ mới</span>
                </button>
            `;

            wsMenuActions.innerHTML = actionsHtml;
        }
    }

    window.handleSwitchWorkspace = async (wsId) => {
        wsDropdownMenu?.classList.remove('active');
        if (!wsId || wsId === SupabaseService.currentWorkspace?.id) return;
        SupabaseService.switchWorkspace(wsId);
        renderHeaderWorkspaceSelector();
        await loadTransactionsData();
    };

    window.openRenameWsModal = () => {
        wsDropdownMenu?.classList.remove('active');
        if (!State.onlineMode || !SupabaseService.currentWorkspace) {
            showToast('Vui lòng đăng nhập để đổi tên sổ!');
            return;
        }
        if (renameWsInput) renameWsInput.value = SupabaseService.currentWorkspace.name || '';
        renameWsModal?.classList.add('active');
        setTimeout(() => renameWsInput?.focus(), 150);
    };

    window.openMembersFromWs = () => {
        wsDropdownMenu?.classList.remove('active');
        document.getElementById('btnOpenMembersModal')?.click();
    };

    window.openCreateWsModal = () => {
        wsDropdownMenu?.classList.remove('active');
        document.getElementById('newWsName').value = '';
        document.getElementById('createWsModal').classList.add('active');
    };

    window.handleDeleteCurrentWs = async (wsId, wsName) => {
        wsDropdownMenu?.classList.remove('active');
        const res = await showCustomConfirm({
            title: 'Xóa Sổ Thu Chi?',
            message: `Bạn có chắc chắn muốn xóa vĩnh viễn Sổ "${wsName}" và tất cả giao dịch trong sổ này?`,
            okText: 'Xóa Sổ',
            okColor: 'var(--expense)'
        });
        if (!res.confirmed) return;

        try {
            await SupabaseService.deleteWorkspace(wsId);
            showToast(`Đã xóa thành công sổ: "${wsName}"`);
            renderHeaderWorkspaceSelector();
            await loadTransactionsData();
        } catch (err) {
            showToast('⚠️ Lỗi khi xóa sổ: ' + err.message);
        }
    };

    window.handleLeaveCurrentWs = async (wsId, wsName) => {
        wsDropdownMenu?.classList.remove('active');
        const res = await showCustomConfirm({
            title: 'Rời Khỏi Sổ?',
            message: `Bạn có chắc chắn muốn rời khỏi Sổ dùng chung "${wsName}" không?`,
            okText: 'Rời Sổ',
            okColor: '#f59e0b',
            icon: 'fa-solid fa-arrow-right-from-bracket',
            iconBg: '#fef3c7',
            iconColor: '#d97706'
        });
        if (!res.confirmed) return;

        try {
            await SupabaseService.leaveWorkspace(wsId);
            showToast(`Đã rời khỏi sổ: "${wsName}"`);
            renderHeaderWorkspaceSelector();
            await loadTransactionsData();
        } catch (err) {
            showToast('⚠️ Lỗi khi rời sổ: ' + err.message);
        }
    };

    // ==================== ĐỔI TÊN SỔ THU CHI ====================
    closeRenameWsModalBtn?.addEventListener('click', () => renameWsModal?.classList.remove('active'));
    btnCancelRenameWs?.addEventListener('click', () => renameWsModal?.classList.remove('active'));

    renameWsForm?.addEventListener('submit', async (e) => {
        e.preventDefault();
        const newName = renameWsInput.value.trim();
        if (!newName || !SupabaseService.currentWorkspace) return;

        try {
            await SupabaseService.renameWorkspace(SupabaseService.currentWorkspace.id, newName);
            showToast(`Đã đổi tên sổ thành: "${newName}"`);
            renameWsModal?.classList.remove('active');
            renderHeaderWorkspaceSelector();
        } catch (err) {
            showToast('⚠️ Lỗi khi đổi tên sổ: ' + err.message);
        }
    });

    // ==================== THÔNG BÁO LỜI MỜI (INVITATIONS) ====================
    async function checkPendingInvitations() {
        if (!State.onlineMode) return;
        try {
            const pendingList = await SupabaseService.fetchPendingInvitations();
            const count = pendingList.length;

            if (count > 0) {
                if (notifBadge) {
                    notifBadge.textContent = count;
                    notifBadge.style.display = 'flex';
                }

                // 1. Render trong Popup Chuông Thông Báo
                if (notifItemsList) {
                    notifItemsList.innerHTML = pendingList.map(inv => {
                        const wsName = inv.workspaces?.name || 'Sổ Thu Chi';
                        const roleText = inv.role === 'admin' ? 'Quản trị viên ⭐' : 'Người ghi chép ✍️';
                        return `
                            <div class="notif-item-card">
                                <div class="notif-card-msg">
                                    Bạn nhận được lời mời tham gia Sổ <b>${wsName}</b> với vai trò <b>${roleText}</b>.
                                </div>
                                <div class="notif-card-actions">
                                    <button class="btn-notif-accept" onclick="handleAcceptInvitation('${inv.id}')">
                                        <i class="fa-solid fa-check"></i> Chấp Nhận
                                    </button>
                                    <button class="btn-notif-reject" onclick="handleRejectInvitation('${inv.id}')">
                                        Từ Chối
                                    </button>
                                </div>
                            </div>
                        `;
                    }).join('');
                }

                // 2. Render Banner Thông Báo Nổi Bật Trên Đầu Trang (Lấy lời mời đầu tiên)
                const firstInv = pendingList[0];
                const wsName = firstInv.workspaces?.name || 'Sổ Thu Chi';
                const roleText = firstInv.role === 'admin' ? 'Quản trị viên ⭐' : 'Người ghi chép ✍️';

                if (invAlertText) {
                    invAlertText.innerHTML = `Bạn nhận được lời mời tham gia Sổ: <b>${wsName}</b> (Vai trò: <b>${roleText}</b>)`;
                }
                if (invAlertActions) {
                    invAlertActions.innerHTML = `
                        <button class="btn-inv-accept" onclick="handleAcceptInvitation('${firstInv.id}')">
                            <i class="fa-solid fa-check"></i> Chấp Nhận
                        </button>
                        <button class="btn-inv-reject" onclick="handleRejectInvitation('${firstInv.id}')">
                            Từ Chối
                        </button>
                    `;
                }
                if (invitationAlertBanner) invitationAlertBanner.style.display = 'flex';
            } else {
                if (notifBadge) notifBadge.style.display = 'none';
                if (invitationAlertBanner) invitationAlertBanner.style.display = 'none';
                if (notifItemsList) {
                    notifItemsList.innerHTML = `<div class="notif-empty-state">Không có lời mời nào mới.</div>`;
                }
            }
        } catch (e) {
            console.error('checkPendingInvitations error:', e);
        }
    }

    window.handleAcceptInvitation = async (invitationId) => {
        try {
            notifDropdownPopup?.classList.remove('active');
            await SupabaseService.acceptInvitation(invitationId);
            showToast('🎉 Đã chấp nhận lời mời! Sổ đã được thêm vào danh sách của bạn.');
            renderHeaderWorkspaceSelector();
            await checkPendingInvitations();
            await loadTransactionsData();
        } catch (err) {
            showToast('⚠️ Lỗi chấp nhận lời mời: ' + err.message);
        }
    };

    window.handleRejectInvitation = async (invitationId) => {
        try {
            notifDropdownPopup?.classList.remove('active');
            await SupabaseService.rejectInvitation(invitationId);
            showToast('Đã từ chối lời mời');
            await checkPendingInvitations();
        } catch (err) {
            showToast('⚠️ Lỗi từ chối lời mời: ' + err.message);
        }
    };

    // ==================== YẾU TỐ THỜI GIAN & LOCAL-FIRST RECONCILIATION THEO CHỈ ĐẠO CỦA SẾP ====================
    async function syncPendingOfflineTransactions() {
        if (!navigator.onLine || !SupabaseService.client) return;

        const targetWsId = SupabaseService.currentWorkspace?.id || localStorage.getItem('smartfinance_active_ws_id');
        if (!targetWsId) return;

        const cacheKey = 'sothuchi_cached_txs_' + targetWsId;
        let localVault = [];
        try {
            localVault = JSON.parse(localStorage.getItem(cacheKey) || '[]');
        } catch (e) {
            return;
        }

        const lastSyncTs = parseInt(localStorage.getItem('sothuchi_last_sync_ts_' + targetWsId) || '0', 10);

        // Nhận diện CHÍNH XÁC các giao dịch offline dựa vào mốc thời gian và trạng thái pending
        const pendingTxs = localVault.filter(t => 
            t.sync_status === 'pending' || 
            t._isOffline === true || 
            (t.local_timestamp && t.local_timestamp > lastSyncTs) ||
            (typeof t.id === 'string' && t.id.startsWith('tx_offline_'))
        );

        if (pendingTxs.length === 0) return;

        console.log(`[TimestampSync] Tìm thấy ${pendingTxs.length} giao dịch offline dựa trên mốc thời gian, đang đẩy lên Cloud...`);
        showToast(`⏳ Đang tự động đồng bộ ${pendingTxs.length} giao dịch offline lên Đám Mây...`);

        let successCount = 0;

        for (const tx of pendingTxs) {
            try {
                const insertPromise = SupabaseService.client
                    .from('transactions')
                    .insert({
                        workspace_id: targetWsId,
                        created_by: SupabaseService.currentUser ? SupabaseService.currentUser.id : null,
                        type: tx.type,
                        amount: Number(tx.amount),
                        note: tx.note,
                        date: tx.date,
                        category_id: tx.category_id || tx.categoryId,
                        sub_items: tx.sub_items || []
                    })
                    .select()
                    .single();

                const timeoutPromise = new Promise((_, reject) => setTimeout(() => reject(new Error('timeout')), 4000));
                const { data, error } = await Promise.race([insertPromise, timeoutPromise]);

                if (!error && data) {
                    successCount++;
                    // Chuyển trạng thái sang synced
                    tx.id = data.id;
                    tx.sync_status = 'synced';
                    tx._isOffline = false;
                    tx.synced_at = Date.now();

                    // Cập nhật State.transactions
                    const idx = State.transactions.findIndex(t => t.id === tx.id || t.local_timestamp === tx.local_timestamp);
                    if (idx >= 0) {
                        State.transactions[idx] = { ...data, categoryId: data.category_id, sub_items: tx.sub_items || [], sync_status: 'synced' };
                    }
                }
            } catch (err) {
                console.warn('[TimestampSync] Lỗi đẩy 1 giao dịch, vẫn giữ an toàn trên máy:', err.message);
            }
        }

        try {
            localStorage.setItem(cacheKey, JSON.stringify(localVault));
            localStorage.setItem('sothuchi_last_sync_ts_' + targetWsId, String(Date.now()));
            localStorage.removeItem('sothuchi_pending_sync_txs');
        } catch (e) {}

        if (successCount > 0) {
            render();
            showToast(`🎉 Đã đồng bộ an toàn ${successCount} khoản thu chi offline lên Cloud!`);
        }
    }

    async function saveTransactionUniversal(tx) {
        const activeWsId = SupabaseService.currentWorkspace?.id || localStorage.getItem('smartfinance_active_ws_id') || 'default_ws';
        const localTimestamp = Date.now();
        const dateIso = tx.date 
            ? (tx.date.includes('Z') || (tx.date.includes('+') && tx.date.length > 18) ? tx.date : Utils.toIsoString(tx.date))
            : new Date().toISOString();

        const newTx = {
            id: tx.id && !tx.id.startsWith('tx_offline_') ? tx.id : ('tx_offline_' + localTimestamp + '_' + Math.random().toString(36).substr(2, 5)),
            workspace_id: activeWsId,
            type: tx.type,
            amount: Number(tx.amount),
            note: tx.note,
            date: dateIso,
            categoryId: tx.categoryId || tx.category_id || (tx.type === 'income' ? 'cat_income_other' : 'cat_food'),
            category_id: tx.categoryId || tx.category_id || (tx.type === 'income' ? 'cat_income_other' : 'cat_food'),
            sub_items: Array.isArray(tx.sub_items) ? tx.sub_items : [],
            local_timestamp: localTimestamp, // MỐC THỜI GIAN
            sync_status: 'pending',          // ĐANG OFFLINE CHUẨN BỊ LÊN
            _isOffline: !navigator.onLine
        };

        // 1. Thêm ngay vào State.transactions và Render tức thì 0ms
        const existingIdx = State.transactions.findIndex(t => t.id === newTx.id);
        if (existingIdx >= 0) {
            State.transactions[existingIdx] = newTx;
        } else {
            State.transactions.unshift(newTx);
        }
        render();

        // 2. Luôn lưu vào kho cục bộ (Local Vault)
        const cacheKey = 'sothuchi_cached_txs_' + activeWsId;
        try {
            let cached = JSON.parse(localStorage.getItem(cacheKey) || '[]');
            const cIdx = cached.findIndex(t => t.id === newTx.id);
            if (cIdx >= 0) cached[cIdx] = newTx;
            else cached.unshift(newTx);
            localStorage.setItem(cacheKey, JSON.stringify(cached));
        } catch (e) {}

        // Luôn đồng bộ vào AppData nếu ở Chế độ Demo hoặc Chế độ Khách (Offline/Guest)
        if (!State.onlineMode || AppData.isDemoMode()) {
            try {
                AppData.addTransaction(newTx);
            } catch (e) {}
        }

        // 3. Nếu đang offline hoặc chưa sẵn sàng Supabase -> Giữ nguyên pending để tự đồng bộ khi có mạng
        if (!navigator.onLine || !State.onlineMode || !SupabaseService.client || !SupabaseService.currentWorkspace) {
            return newTx;
        }

        // 4. Nếu đang online -> Lưu lên Supabase
        try {
            const cloudRes = await SupabaseService.addTransaction(newTx);
            if (cloudRes && cloudRes.id) {
                newTx.id = cloudRes.id;
                newTx.sync_status = 'synced';
                newTx._isOffline = false;
                const idx = State.transactions.findIndex(t => t.id === newTx.id || t.local_timestamp === localTimestamp);
                if (idx >= 0) {
                    State.transactions[idx] = { ...cloudRes, categoryId: cloudRes.category_id || cloudRes.categoryId, sub_items: newTx.sub_items, sync_status: 'synced' };
                    render();
                }
            }
            return cloudRes;
        } catch (err) {
            console.warn('Lưu Cloud thất bại, tiếp tục giữ pending trên máy:', err);
            return newTx;
        }
    }

    async function loadTransactionsData() {
        let cloudTxs = [];
        if (State.onlineMode && SupabaseService.currentWorkspace) {
            State.userRole = SupabaseService.currentRole || 'contributor';
            userRoleBadge.textContent = State.userRole === 'owner' ? 'Owner 👑' : (State.userRole === 'admin' ? 'Admin ⭐' : 'Ghi chép ✍️');

            cloudTxs = await SupabaseService.getTransactions(SupabaseService.currentWorkspace.id);

            SupabaseService.subscribeRealtime(SupabaseService.currentWorkspace.id, async () => {
                const refreshed = await SupabaseService.getTransactions(SupabaseService.currentWorkspace.id);
                mergeAndRenderTransactions(refreshed);
            });
        } else {
            cloudTxs = AppData.getTransactions();
        }

        mergeAndRenderTransactions(cloudTxs);
        if (typeof updateDebtsSummaryUI === 'function') updateDebtsSummaryUI();

        if (navigator.onLine) {
            setTimeout(syncPendingOfflineTransactions, 600);
        }
    }

    function mergeAndRenderTransactions(baseList = []) {
        const activeWsId = SupabaseService.currentWorkspace?.id || localStorage.getItem('smartfinance_active_ws_id') || 'default_ws';
        const cacheKey = 'sothuchi_cached_txs_' + activeWsId;
        const lastSyncTs = parseInt(localStorage.getItem('sothuchi_last_sync_ts_' + activeWsId) || '0', 10);

        let localVault = [];
        try {
            localVault = JSON.parse(localStorage.getItem(cacheKey) || '[]');
        } catch (e) {}

        // YẾU TỐ THỜI GIAN: Nhận diện các giao dịch offline chuẩn bị lên
        const pendingTxs = localVault.filter(t => 
            t.sync_status === 'pending' || 
            t._isOffline === true || 
            (t.local_timestamp && t.local_timestamp > lastSyncTs) ||
            (typeof t.id === 'string' && t.id.startsWith('tx_offline_'))
        );

        const merged = [...pendingTxs];
        (baseList || []).forEach(ctx => {
            if (!merged.some(m => m.id === ctx.id || (m.sync_status === 'pending' && m.note === ctx.note && Number(m.amount) === Number(ctx.amount) && Math.abs(new Date(m.date) - new Date(ctx.date)) < 120000))) {
                merged.push(ctx);
            }
        });

        merged.sort((a, b) => new Date(b.date) - new Date(a.date));
        State.transactions = merged;
        render();
    }

    function loadDraftTransactions() {
        mergeAndRenderTransactions(AppData.getTransactions());
    }

    // ==================== FILTERING & PAGINATION ====================
    function getFilteredTransactionsByPeriod() {
        let list = [...State.transactions];
        const now = new Date();
        const todayLocalStr = Utils.getLocalDateString(now);

        if (State.period === 'this_month') {
            const currentYear = now.getFullYear();
            const currentMonth = now.getMonth();
            list = list.filter(t => {
                const d = new Date(t.date);
                return !isNaN(d.getTime()) && d.getFullYear() === currentYear && d.getMonth() === currentMonth;
            });
        } else if (State.period === 'today') {
            list = list.filter(t => {
                const d = new Date(t.date);
                return !isNaN(d.getTime()) && Utils.getLocalDateString(d) === todayLocalStr;
            });
        } else if (State.period === 'yesterday') {
            const yesterday = new Date();
            yesterday.setDate(now.getDate() - 1);
            const yesterdayLocalStr = Utils.getLocalDateString(yesterday);
            list = list.filter(t => {
                const d = new Date(t.date);
                return !isNaN(d.getTime()) && Utils.getLocalDateString(d) === yesterdayLocalStr;
            });
        } else if (State.period === 'last_month') {
            const prevMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
            const targetYear = prevMonth.getFullYear();
            const targetMonth = prevMonth.getMonth();
            list = list.filter(t => {
                const d = new Date(t.date);
                return !isNaN(d.getTime()) && d.getFullYear() === targetYear && d.getMonth() === targetMonth;
            });
        } else if (State.period === 'custom') {
            if (State.startDate) {
                const start = new Date(State.startDate + 'T00:00:00');
                list = list.filter(t => new Date(t.date) >= start);
            }
            if (State.endDate) {
                const end = new Date(State.endDate + 'T23:59:59');
                list = list.filter(t => new Date(t.date) <= end);
            }
        }
        return list;
    }

    function getPeriodStartDate() {
        const now = new Date();
        if (State.period === 'this_month') {
            return new Date(now.getFullYear(), now.getMonth(), 1, 0, 0, 0, 0);
        } else if (State.period === 'today') {
            return new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0);
        } else if (State.period === 'yesterday') {
            return new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1, 0, 0, 0, 0);
        } else if (State.period === 'last_month') {
            return new Date(now.getFullYear(), now.getMonth() - 1, 1, 0, 0, 0, 0);
        } else if (State.period === 'custom' && State.startDate) {
            return new Date(State.startDate + 'T00:00:00');
        }
        return null;
    }

    function getTableFilteredList() {
        let list = getFilteredTransactionsByPeriod();

        if (State.type !== 'all') {
            list = list.filter(t => t.type === State.type);
        }

        if (State.keyword.trim()) {
            const q = State.keyword.toLowerCase().trim();
            list = list.filter(t => 
                (t.note || '').toLowerCase().includes(q) || 
                (AppData.getCategoryById(t.categoryId)?.name || '').toLowerCase().includes(q)
            );
        }

        return list;
    }

    function getCustomOpeningBalance() {
        const currentWsId = (State.onlineMode && SupabaseService.currentWorkspace) ? SupabaseService.currentWorkspace.id : 'default';
        const storageKey = `sothuchi_opening_balance_${currentWsId}`;
        const val = localStorage.getItem(storageKey);
        return val !== null && !isNaN(Number(val)) ? Number(val) : 0;
    }

    async function promptSetOpeningBalance() {
        const currentWsId = (State.onlineMode && SupabaseService.currentWorkspace) ? SupabaseService.currentWorkspace.id : 'default';
        const storageKey = `sothuchi_opening_balance_${currentWsId}`;
        const currentVal = getCustomOpeningBalance();

        const res = await showCustomPrompt({
            title: 'Thiết Lập Số Dư Đầu Kỳ',
            message: 'Nhập số tiền ban đầu bạn đang có (để trống hoặc 0 nếu bắt đầu từ 0 đ):',
            defaultValue: currentVal > 0 ? currentVal.toLocaleString('vi-VN') : '',
            placeholder: 'Ví dụ: 10tr hoặc 10000000',
            okText: 'Lưu số dư'
        });

        if (res !== null) {
            const parsed = Utils.parseInputAmount(res);
            const newBal = (parsed > 0) ? parsed : 0;
            localStorage.setItem(storageKey, newBal.toString());
            render();
            showToast(`Đã lưu Số dư đầu kỳ: ${Utils.formatCurrency(newBal)}`);
        }
    }

    // ==================== RENDER MAIN VIEW ====================
    function render() {
        const periodTxs = getFilteredTransactionsByPeriod();

        // 1. Số dư đầu kỳ: Do người dùng tự nhập vào, nếu không nhập mặc định là 0 đ
        const openingBalance = getCustomOpeningBalance();

        // 2. Thu, Chi và Số dư trong kỳ
        const totalInc = periodTxs.filter(t => t.type === 'income').reduce((sum, t) => sum + (Number(t.amount) || 0), 0);
        const totalExp = periodTxs.filter(t => t.type === 'expense').reduce((sum, t) => sum + (Number(t.amount) || 0), 0);
        const netPeriodBalance = totalInc - totalExp;

        // 3. Số dư thực tế hiện tại
        const currentTotalBalance = openingBalance + netPeriodBalance;

        const countInc = periodTxs.filter(t => t.type === 'income').length;
        const countExp = periodTxs.filter(t => t.type === 'expense').length;

        // Top Banner Numbers
        totalBalanceVal.textContent = Utils.formatCurrency(currentTotalBalance);
        if (subOpeningBalance) subOpeningBalance.textContent = Utils.formatCurrency(openingBalance);
        if (mobileOpeningBalanceTag) mobileOpeningBalanceTag.innerHTML = `Đầu kỳ: ${Utils.formatCurrency(openingBalance)} <i class="fa-solid fa-pen" style="font-size: 8px; margin-left: 3px; opacity: 0.7;"></i>`;

        subTotalIncome.textContent = `+${Utils.formatCurrency(totalInc)}`;
        subTotalExpense.textContent = `-${Utils.formatCurrency(totalExp)}`;

        totalIncomeVal.textContent = `+${Utils.formatCurrency(totalInc)}`;
        incomeCountLabel.textContent = `${countInc} khoản thu`;

        totalExpenseVal.textContent = `-${Utils.formatCurrency(totalExp)}`;
        expenseCountLabel.textContent = `${countExp} khoản chi`;

        // Table List
        const fullFilteredList = getTableFilteredList();
        const totalRows = fullFilteredList.length;
        tableTxCount.textContent = `${totalRows} giao dịch`;

        const isMobile = window.innerWidth <= 768;
        let pageItems = [];
        let startIndex = 0;
        let endIndex = 0;

        const lazyIndicator = document.getElementById('mobileLazyIndicator');
        const endOfList = document.getElementById('mobileEndOfList');

        if (isMobile) {
            // Mobile: Lazy Load / Infinite Scroll (kéo tới đâu hiển thị tới đó)
            startIndex = 0;
            endIndex = Math.min(State.mobileVisibleCount, totalRows);
            pageItems = fullFilteredList.slice(0, endIndex);

            paginationSummaryText.textContent = totalRows > 0 
                ? `Đang hiển thị ${endIndex}/${totalRows} giao dịch` 
                : 'Hiển thị 0 giao dịch';

            if (lazyIndicator) lazyIndicator.style.display = (totalRows > endIndex) ? 'flex' : 'none';
            if (endOfList) endOfList.style.display = (totalRows > 0 && endIndex >= totalRows) ? 'block' : 'none';
        } else {
            // Desktop: Phân trang truyền thống chuẩn mẫu
            const totalPages = Math.max(1, Math.ceil(totalRows / State.rowsPerPage));
            if (State.currentPage > totalPages) State.currentPage = totalPages;

            startIndex = (State.currentPage - 1) * State.rowsPerPage;
            endIndex = Math.min(startIndex + State.rowsPerPage, totalRows);
            pageItems = fullFilteredList.slice(startIndex, endIndex);

            paginationSummaryText.textContent = totalRows > 0 
                ? `Hiển thị ${startIndex + 1}-${endIndex} của ${totalRows} giao dịch` 
                : 'Hiển thị 0 giao dịch';

            currentPageNumber.textContent = State.currentPage;
            btnPrevPage.disabled = (State.currentPage <= 1);
            btnNextPage.disabled = (State.currentPage >= totalPages);

            if (lazyIndicator) lazyIndicator.style.display = 'none';
            if (endOfList) endOfList.style.display = 'none';
        }

        if (totalRows === 0) {
            txTableBody.innerHTML = '';
            emptyDataState.style.display = 'block';
            if (lazyIndicator) lazyIndicator.style.display = 'none';
            if (endOfList) endOfList.style.display = 'none';
            return;
        }

        emptyDataState.style.display = 'none';
        const canEditOrDelete = (State.userRole === 'owner' || State.userRole === 'admin');

        txTableBody.innerHTML = pageItems.map((t, index) => {
            const isInc = t.type === 'income';
            const sign = isInc ? '+' : '-';
            const typeLabel = isInc ? 'Thu' : 'Chi';
            const typeClass = isInc ? 'type-income' : 'type-expense';
            const icon = isInc ? 'fa-arrow-down' : 'fa-arrow-up';
            const cat = AppData.getCategoryById(t.categoryId || t.category_id, t.note, t.type);
            const isYesterday = (t.date || '').includes('2026-08-15');
            const timeIcon = isYesterday ? 'fa-regular fa-clock' : 'fa-regular fa-calendar';
            const friendlyTime = Utils.formatFriendlyDateTime(t.date);
            const shortTime = Utils.formatShortDateTime ? Utils.formatShortDateTime(t.date) : friendlyTime;

            const hasSubItems = t.sub_items && Array.isArray(t.sub_items) && t.sub_items.length > 0;
            const subItemsCount = hasSubItems ? t.sub_items.length : 0;

            return `
                <tr class="tx-card-row" data-id="${t.id}">
                    <td class="col-stt" style="text-align: center;">
                        <span class="stt-num">${startIndex + index + 1}</span>
                    </td>
                    <td class="col-type" style="text-align: center;">
                        <span class="type-pill ${typeClass}">
                            <i class="fa-solid ${icon}"></i> <span>${typeLabel}</span>
                        </span>
                        <span class="tx-time-sub-tag">${shortTime}</span>
                    </td>
                    <td class="col-time">
                        <div class="tx-time-cell">
                            <i class="${timeIcon}"></i> ${friendlyTime}
                        </div>
                    </td>
                    <td class="col-desc">
                        <div class="tx-desc-cell">
                            <span>${t.note || 'Không có ghi chú'}</span>
                            ${hasSubItems ? `<button type="button" class="badge-has-subitems" data-id="${t.id}" title="Bấm để xem danh sách món con"><i class="fa-solid fa-receipt"></i> <span>${subItemsCount} món</span> <i class="fa-solid fa-chevron-down"></i></button>` : ''}
                        </div>
                        <div class="tx-mobile-meta">
                            <span class="meta-cat">${cat.emoji} ${cat.name}</span>
                            ${hasSubItems ? `<button type="button" class="badge-has-subitems mobile-sub-badge" data-id="${t.id}"><i class="fa-solid fa-receipt"></i> <span>${subItemsCount} món</span> <i class="fa-solid fa-chevron-down"></i></button>` : ''}
                        </div>
                        ${hasSubItems ? `
                            <div class="tx-subitems-panel" id="subPanel_${t.id}" style="display: none;">
                                ${t.sub_items.map(sub => {
                                    const subCat = AppData.getCategoryById(sub.categoryId, sub.name, t.type);
                                    return `
                                        <div class="subitem-view-row">
                                            <span class="subitem-view-name">
                                                <span>${subCat.emoji}</span>
                                                <span>${sub.name || 'Món con'}</span>
                                                <span class="subitem-cat-tag">${subCat.name}</span>
                                            </span>
                                            <span class="subitem-view-amount ${isInc ? 'text-income' : 'text-expense'}">
                                                ${sign}${Utils.formatCurrency(sub.amount)}
                                            </span>
                                        </div>
                                    `;
                                }).join('')}
                            </div>
                        ` : ''}
                    </td>
                    <td class="col-cat">
                        <div class="cat-tag-pill">
                            <span class="cat-emoji">${cat.emoji}</span>
                            <span class="cat-name">${cat.name}</span>
                        </div>
                    </td>
                    <td class="col-amount tx-amount-cell-bold ${isInc ? 'text-income' : 'text-expense'}">
                        ${sign}${Utils.formatCurrency(t.amount)}
                    </td>
                    <td class="col-actions" style="text-align: center;">
                        <div class="row-actions-group">
                            <button class="btn-icon-table btn-edit-table" data-id="${t.id}" title="Sửa giao dịch">
                                <i class="fa-solid fa-pen"></i>
                            </button>
                            <button class="btn-icon-table btn-del-table" data-id="${t.id}" title="Xóa giao dịch">
                                <i class="fa-solid fa-trash-can"></i>
                            </button>
                        </div>
                    </td>
                </tr>
            `;
        }).join('');

        // Bắt sự kiện bấm mở Accordion xem món con
        document.querySelectorAll('.badge-has-subitems').forEach(badge => {
            badge.addEventListener('click', (e) => {
                e.stopPropagation();
                const txId = badge.dataset.id;
                const panel = document.getElementById(`subPanel_${txId}`);
                if (panel) {
                    const isHidden = panel.style.display === 'none';
                    panel.style.display = isHidden ? 'block' : 'none';
                    badge.classList.toggle('expanded', isHidden);
                    const icon = badge.querySelector('.fa-chevron-down, .fa-chevron-up');
                    if (icon) {
                        icon.className = isHidden ? 'fa-solid fa-chevron-up' : 'fa-solid fa-chevron-down';
                    }
                }
            });
        });

        // Row Click to Edit (Perfect for Mobile Tap-to-Edit & Desktop)
        document.querySelectorAll('.tx-card-row').forEach(row => {
            row.addEventListener('click', (e) => {
                if (e.target.closest('.btn-icon-table') || e.target.closest('.badge-has-subitems') || e.target.closest('.tx-subitems-panel')) return;
                openModalWithData(row.dataset.id);
            });
        });

        // Action listeners for desktop action buttons
        document.querySelectorAll('.btn-edit-table').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                openModalWithData(btn.dataset.id);
            });
        });

        document.querySelectorAll('.btn-del-table').forEach(btn => {
            btn.addEventListener('click', async (e) => {
                e.stopPropagation();
                const res = await showCustomConfirm({
                    title: 'Xóa Giao Dịch?',
                    message: 'Bạn có chắc chắn muốn xóa giao dịch này?',
                    okText: 'Xóa',
                    okColor: '#dc2626',
                    requireReason: false
                });

                if (res && res.confirmed) {
                    if (State.onlineMode) {
                        await SupabaseService.deleteTransaction(btn.dataset.id, res.reason || '');
                    } else {
                        AppData.deleteTransaction(btn.dataset.id);
                    }
                    showToast('Đã xóa giao dịch!');
                    await loadTransactionsData();
                }
            });
        });
    }

    // ==================== MODAL THÊM / SỬA GIAO DỊCH ====================
    function populateCategoriesForType(type, selectedCatId = null) {
        const list = AppData.getCategoriesByType(type);
        let optionsHtml = list.map(c => 
            `<option value="${c.id}" ${c.id === selectedCatId ? 'selected' : ''}>${c.emoji} ${c.name}</option>`
        ).join('');
        
        optionsHtml += `<option value="__add_new__" style="color: var(--primary); font-weight: 700;">✨ + Thêm danh mục mới...</option>`;
        txCategory.innerHTML = optionsHtml;

        if (selectedCatId && list.some(c => c.id === selectedCatId)) {
            txCategory.value = selectedCatId;
        } else if (list.length > 0) {
            txCategory.value = list[0].id;
        }
    }

    txCategory?.addEventListener('change', (e) => {
        if (e.target.value === '__add_new__') {
            openCatManagerModal(txType.value);
        }
    });

    function setModalType(type, targetCatId = null) {
        txType.value = type;
        const isInc = type === 'income';
        document.querySelectorAll('.tab-type-btn').forEach(b => {
            b.classList.toggle('active', b.dataset.type === type);
        });
        
        if (txId.value) {
            modalTitle.textContent = isInc ? 'Chỉnh Sửa Khoản Thu (+)' : 'Chỉnh Sửa Khoản Chi (-)';
        } else {
            modalTitle.textContent = isInc ? 'Thêm Khoản Thu (+)' : 'Thêm Khoản Chi (-)';
        }
        
        // Luôn nạp lại danh mục tương ứng với Loại (Ngăn chặn 100% lẫn lộn)
        populateCategoriesForType(type, targetCatId);
    }

    function openModalForNew(type = 'income') {
        txId.value = '';
        txAmount.value = '';
        txNote.value = '';
        document.getElementById('aiSentenceInput').value = '';
        if (aiSubItemsInput) aiSubItemsInput.value = '';
        txDate.value = Utils.getCurrentDateTimeLocal();
        
        currentModalSubItems = [];
        renderSubItemsInModal();
        toggleSubItemsSection(false);

        const aiBox = document.getElementById('aiNlpQuickBox');
        if (aiBox) aiBox.style.display = 'block';

        const btnDel = document.getElementById('btnDeleteTxModal');
        if (btnDel) btnDel.style.display = 'none';

        setModalType(type);

        txModal.classList.add('active');
        setTimeout(() => {
            const aiInput = document.getElementById('aiSentenceInput');
            if (aiInput) aiInput.focus();
            else txAmount.focus();
        }, 100);
    }

    // Expose ra window để các nút onclick HTML gọi tức thì 100% không sợ lag
    window.openModalForNew = openModalForNew;
    window.setModalType = setModalType;
    window.handleOpenIncomeModal = () => openModalForNew('income');
    window.handleOpenExpenseModal = () => openModalForNew('expense');
    window.handleSelectModalType = (t) => setModalType(t);
    window.handleCloseTxModal = () => closeModal();

    function openModalWithData(id) {
        const tx = State.transactions.find(t => t.id === id);
        if (!tx) return;

        txId.value = tx.id;
        txAmount.value = Number(tx.amount).toLocaleString('vi-VN');
        txNote.value = tx.note || '';
        document.getElementById('aiSentenceInput').value = tx.note || '';
        if (aiSubItemsInput) aiSubItemsInput.value = '';
        txDate.value = tx.date ? Utils.formatDateTimeForInput(tx.date) : Utils.getCurrentDateTimeLocal();
        
        currentModalSubItems = Array.isArray(tx.sub_items) ? JSON.parse(JSON.stringify(tx.sub_items)) : [];
        renderSubItemsInModal();
        if (currentModalSubItems.length > 0) {
            toggleSubItemsSection(true);
        } else {
            toggleSubItemsSection(false);
        }

        const aiBox = document.getElementById('aiNlpQuickBox');
        if (aiBox) aiBox.style.display = 'block';

        const btnDel = document.getElementById('btnDeleteTxModal');
        if (btnDel) btnDel.style.display = 'inline-flex';

        setModalType(tx.type, tx.categoryId);

        modalTitle.textContent = tx.type === 'income' ? 'Chỉnh Sửa Khoản Thu (+)' : 'Chỉnh Sửa Khoản Chi (-)';
        txModal.classList.add('active');
    }

    function closeModal() {
        txModal.classList.remove('active');
        if (speechRecognitionInstance) {
            try { speechRecognitionInstance.stop(); } catch (e) {}
        }
    }

    // Xóa trực tiếp từ bên trong Modal khi đang sửa
    const btnDeleteTxModal = document.getElementById('btnDeleteTxModal');
    btnDeleteTxModal?.addEventListener('click', async () => {
        const id = txId.value;
        if (!id) return;
        
        const res = await showCustomConfirm({
            title: 'Xóa Giao Dịch?',
            message: 'Bạn có chắc chắn muốn xóa vĩnh viễn giao dịch này?',
            okText: 'Xóa',
            okColor: '#dc2626',
            requireReason: false
        });

        if (res && res.confirmed) {
            if (State.onlineMode) {
                await SupabaseService.deleteTransaction(id, res.reason || '');
            } else {
                AppData.deleteTransaction(id);
            }
            showToast('Đã xóa giao dịch!');
            closeModal();
            await loadTransactionsData();
        }
    });

    // ==================== BỘ PHÂN TÍCH NLP & GIỌNG NÓI ====================
    const aiSentenceInput = document.getElementById('aiSentenceInput');
    const btnAiParseApply = document.getElementById('btnAiParseApply');
    const btnVoiceRecord = document.getElementById('btnVoiceRecord');
    const voiceMicIcon = document.getElementById('voiceMicIcon');
    const voiceMicText = document.getElementById('voiceMicText');

    function applyParsedSentence(text) {
        if (!text) return;
        const res = Utils.parseNaturalSentence(text);
        if (res) {
            setModalType(res.type, res.categoryId);
            if (res.amount > 0) {
                txAmount.value = Number(res.amount).toLocaleString('vi-VN');
            }
            if (res.note) {
                txNote.value = res.note;
            }
            showToast(`✨ AI nhận diện: [${res.type === 'income' ? 'Thu' : 'Chi'}] ${res.emoji} ${res.categoryName}`);
        }
    }

    btnAiParseApply?.addEventListener('click', (e) => {
        e.preventDefault();
        applyParsedSentence(aiSentenceInput?.value);
    });

    let aiInputDebounceTimer = null;
    aiSentenceInput?.addEventListener('input', (e) => {
        const text = e.target.value;
        clearTimeout(aiInputDebounceTimer);
        if (text && text.trim().length >= 3) {
            aiInputDebounceTimer = setTimeout(() => {
                applyParsedSentence(text);
            }, 300);
        }
    });

    aiSentenceInput?.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            const text = aiSentenceInput.value.trim();
            if (text) {
                applyParsedSentence(text);
            }
            txForm?.dispatchEvent(new Event('submit'));
        }
    });

    // ==================== BỘ ĐIỀU KHIỂN CHI TIẾT MÓN CON (SUB-ITEMS) ====================
    let currentModalSubItems = [];
    const btnToggleSubItems = document.getElementById('btnToggleSubItems');
    const subItemsSection = document.getElementById('subItemsSection');
    const subItemsCountBadge = document.getElementById('subItemsCountBadge');
    const subToggleArrow = document.getElementById('subToggleArrow');
    const aiSubItemsInput = document.getElementById('aiSubItemsInput');
    const btnSubAiApply = document.getElementById('btnSubAiApply');
    const btnSubVoiceRecord = document.getElementById('btnSubVoiceRecord');
    const subVoiceText = document.getElementById('subVoiceText');
    const subItemsListContainer = document.getElementById('subItemsListContainer');
    const btnAddSubItemRow = document.getElementById('btnAddSubItemRow');
    const subItemsTotalVal = document.getElementById('subItemsTotalVal');
    const btnSyncAmountFromSubItems = document.getElementById('btnSyncAmountFromSubItems');

    function toggleSubItemsSection(forceOpen = null) {
        if (!subItemsSection) return;
        const isCurrentlyOpen = subItemsSection.style.display !== 'none';
        const willOpen = forceOpen !== null ? forceOpen : !isCurrentlyOpen;
        subItemsSection.style.display = willOpen ? 'block' : 'none';
        btnToggleSubItems?.classList.toggle('active', willOpen);
    }

    btnToggleSubItems?.addEventListener('click', () => {
        toggleSubItemsSection();
        if (subItemsSection.style.display !== 'none' && currentModalSubItems.length === 0) {
            // Tự động thêm 1 dòng trống đầu tiên nếu chưa có
            addSubItemRow();
        }
    });

    function addSubItemRow(name = '', amount = 0, categoryId = '') {
        currentModalSubItems.push({
            id: 'sub_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4),
            name: name,
            amount: amount,
            categoryId: categoryId || txCategory.value || (txType.value === 'income' ? 'cat_income_other' : 'cat_food')
        });
        renderSubItemsInModal();
        setTimeout(() => {
            const inputs = subItemsListContainer?.querySelectorAll('.sub-item-name-input');
            if (inputs && inputs.length > 0) inputs[inputs.length - 1].focus();
        }, 50);
    }

    btnAddSubItemRow?.addEventListener('click', () => {
        addSubItemRow();
    });

    function renderSubItemsInModal() {
        if (!subItemsListContainer) return;
        
        const count = currentModalSubItems.length;
        if (subItemsCountBadge) {
            if (count > 0) {
                subItemsCountBadge.textContent = `${count} món`;
                subItemsCountBadge.style.display = 'inline-block';
            } else {
                subItemsCountBadge.style.display = 'none';
            }
        }

        const availableCats = AppData.getCategoriesByType(txType.value);
        
        let totalSub = 0;
        subItemsListContainer.innerHTML = currentModalSubItems.map((item, idx) => {
            const amt = Number(item.amount) || 0;
            totalSub += amt;

            return `
                <div class="sub-item-edit-row" data-index="${idx}">
                    <input type="text" class="sub-item-name-input" placeholder="Tên món..." value="${item.name || ''}" data-index="${idx}">
                    <input type="text" class="sub-item-amount-input" placeholder="Số tiền..." value="${amt > 0 ? amt.toLocaleString('vi-VN') : ''}" data-index="${idx}">
                    <select class="sub-item-cat-select" data-index="${idx}">
                        ${availableCats.map(c => `<option value="${c.id}" ${c.id === item.categoryId ? 'selected' : ''}>${c.emoji} ${c.name}</option>`).join('')}
                    </select>
                    <button type="button" class="btn-del-sub-row" data-index="${idx}" title="Xóa món này">&times;</button>
                </div>
            `;
        }).join('');

        if (subItemsTotalVal) {
            subItemsTotalVal.textContent = Utils.formatCurrency(totalSub);
        }

        // Bắt sự kiện chỉnh sửa trực tiếp từng dòng
        subItemsListContainer.querySelectorAll('.sub-item-name-input').forEach(inp => {
            inp.addEventListener('input', (e) => {
                const idx = parseInt(e.target.dataset.index, 10);
                if (currentModalSubItems[idx]) {
                    currentModalSubItems[idx].name = e.target.value;
                }
            });
            inp.addEventListener('blur', (e) => {
                const idx = parseInt(e.target.dataset.index, 10);
                const val = e.target.value.trim();
                if (val && (!currentModalSubItems[idx].categoryId || currentModalSubItems[idx].categoryId.includes('unclassified'))) {
                    const pred = Utils.predictCategory(val, txType.value);
                    if (pred) {
                        currentModalSubItems[idx].categoryId = pred.categoryId;
                        renderSubItemsInModal();
                    }
                }
            });
        });

        subItemsListContainer.querySelectorAll('.sub-item-amount-input').forEach(inp => {
            inp.addEventListener('input', (e) => {
                const idx = parseInt(e.target.dataset.index, 10);
                const parsed = Utils.parseInputAmount(e.target.value);
                if (currentModalSubItems[idx]) {
                    currentModalSubItems[idx].amount = parsed;
                    updateSubItemsTotalDisplay();
                }
            });
            inp.addEventListener('blur', (e) => {
                const parsed = Utils.parseInputAmount(e.target.value);
                if (parsed > 0) e.target.value = parsed.toLocaleString('vi-VN');
            });
        });

        subItemsListContainer.querySelectorAll('.sub-item-cat-select').forEach(sel => {
            sel.addEventListener('change', (e) => {
                const idx = parseInt(e.target.dataset.index, 10);
                if (currentModalSubItems[idx]) {
                    currentModalSubItems[idx].categoryId = e.target.value;
                }
            });
        });

        subItemsListContainer.querySelectorAll('.btn-del-sub-row').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const idx = parseInt(btn.dataset.index, 10);
                currentModalSubItems.splice(idx, 1);
                renderSubItemsInModal();
            });
        });
    }

    function updateSubItemsTotalDisplay() {
        const total = currentModalSubItems.reduce((s, it) => s + (Number(it.amount) || 0), 0);
        if (subItemsTotalVal) subItemsTotalVal.textContent = Utils.formatCurrency(total);
    }

    btnSyncAmountFromSubItems?.addEventListener('click', () => {
        const total = currentModalSubItems.reduce((s, it) => s + (Number(it.amount) || 0), 0);
        if (total > 0) {
            txAmount.value = total.toLocaleString('vi-VN');
            showToast(`Đã đồng bộ số tiền: ${Utils.formatCurrency(total)}`);
        } else {
            showToast('⚠️ Vui lòng nhập số tiền cho các món con trước!');
        }
    });

    function applySubItemsSentence(text) {
        if (!text) return;
        const items = Utils.parseCompoundSentence(text, txType.value);
        if (items.length > 0) {
            currentModalSubItems = items;
            renderSubItemsInModal();
            toggleSubItemsSection(true);
            const total = items.reduce((s, it) => s + (Number(it.amount) || 0), 0);
            if (total > 0) {
                txAmount.value = total.toLocaleString('vi-VN');
            }
            showToast(`✨ Đã bóc tách thành công ${items.length} món con!`);
            if (aiSubItemsInput) aiSubItemsInput.value = '';
        } else {
            showToast('⚠️ Chưa nhận diện được món nào. Bạn hãy thử: xà bông 17k, cọ rửa 2k...');
        }
    }

    btnSubAiApply?.addEventListener('click', () => {
        applySubItemsSentence(aiSubItemsInput?.value);
    });

    aiSubItemsInput?.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            applySubItemsSentence(aiSubItemsInput.value);
        }
    });

    // ==================== QUẢN LÝ QUYỀN MICROPHONE (CHO IPHONE & BROWSER) ====================
    const micPermissionModal = document.getElementById('micPermissionModal');
    const micIosInstructions = document.getElementById('micIosInstructions');
    const btnGrantMicPermission = document.getElementById('btnGrantMicPermission');
    const btnDismissMicModal = document.getElementById('btnDismissMicModal');
    const closeMicModalBtn = document.getElementById('closeMicModalBtn');

    async function requestMicrophoneAccess() {
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
            showToast('⚠️ Trình duyệt chưa hỗ trợ truy cập Micro trực tiếp');
            micPermissionModal?.classList.remove('active');
            return false;
        }

        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            // Tắt stream ngay sau khi người dùng đồng ý
            stream.getTracks().forEach(t => t.stop());
            localStorage.setItem('sothuchi_mic_granted', 'true');
            micPermissionModal?.classList.remove('active');
            if (micIosInstructions) micIosInstructions.style.display = 'none';
            showToast('🎙️ Đã cấp quyền Micro thành công! Bạn có thể nói để ghi chép.');
            return true;
        } catch (err) {
            console.warn('Microphone permission not granted:', err);
            if (micIosInstructions) micIosInstructions.style.display = 'block';
            showToast('⚠️ Vui lòng cho phép quyền Micro trong Cài đặt Safari / Trình duyệt!');
            return false;
        }
    }

    btnGrantMicPermission?.addEventListener('click', () => {
        requestMicrophoneAccess();
    });

    btnDismissMicModal?.addEventListener('click', () => {
        sessionStorage.setItem('sothuchi_mic_dismissed', 'true');
        micPermissionModal?.classList.remove('active');
    });

    closeMicModalBtn?.addEventListener('click', () => {
        sessionStorage.setItem('sothuchi_mic_dismissed', 'true');
        micPermissionModal?.classList.remove('active');
    });

    micPermissionModal?.addEventListener('click', (e) => {
        if (e.target === micPermissionModal) {
            sessionStorage.setItem('sothuchi_mic_dismissed', 'true');
            micPermissionModal?.classList.remove('active');
        }
    });

    // Tự động kiểm tra quyền khi mở ứng dụng (bỏ qua nếu đã cấp phép rồi)
    async function initMicrophonePermissionCheck() {
        if (localStorage.getItem('sothuchi_mic_granted') === 'true') {
            return;
        }

        if (navigator.permissions && navigator.permissions.query) {
            try {
                const p = await navigator.permissions.query({ name: 'microphone' });
                if (p.state === 'granted') {
                    localStorage.setItem('sothuchi_mic_granted', 'true');
                    return;
                }
            } catch (e) {}
        }

        // Nếu chưa cấp quyền và chưa bấm "Để sau" trong phiên này -> Hiện modal nhắc nhở sau 1.5 giây
        setTimeout(() => {
            if (!sessionStorage.getItem('sothuchi_mic_dismissed') && localStorage.getItem('sothuchi_mic_granted') !== 'true') {
                micPermissionModal?.classList.add('active');
            }
        }, 1200);
    }

    initMicrophonePermissionCheck();

    // Voice Speech Recognition (Web Speech API)
    let speechRecognitionInstance = null;
    let isRecording = false;

    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        speechRecognitionInstance = new SpeechRecognition();
        speechRecognitionInstance.continuous = false;
        speechRecognitionInstance.interimResults = false;
        speechRecognitionInstance.lang = 'vi-VN';

        speechRecognitionInstance.onstart = () => {
            isRecording = true;
            btnVoiceRecord.classList.add('recording');
            voiceMicText.textContent = 'Đang nghe...';
        };

        speechRecognitionInstance.onresult = (event) => {
            const transcript = event.results[0][0].transcript;
            if (aiSentenceInput) aiSentenceInput.value = transcript;
            applyParsedSentence(transcript);
        };

        speechRecognitionInstance.onerror = (event) => {
            console.error('Speech recognition error:', event.error);
            if (event.error === 'not-allowed') {
                if (micIosInstructions) micIosInstructions.style.display = 'block';
                micPermissionModal?.classList.add('active');
                showToast('⚠️ Vui lòng cấp quyền Micro trong Cài đặt để nhận diện giọng nói!');
            } else if (event.error === 'no-speech') {
                showToast('Chưa nghe thấy giọng nói. Bạn hãy nói to và rõ hơn nhé!');
            } else if (event.error === 'network') {
                showToast('Vui lòng kiểm tra kết nối mạng để nhận diện giọng nói!');
            } else {
                showToast('Chưa nhận diện được. Bạn hãy thử lại hoặc gõ vào ô nhé!');
            }
        };

        speechRecognitionInstance.onend = () => {
            isRecording = false;
            btnVoiceRecord.classList.remove('recording');
            voiceMicText.textContent = 'Thu âm';
        };

        btnVoiceRecord?.addEventListener('click', async () => {
            if (isRecording) {
                speechRecognitionInstance.stop();
            } else {
                if (localStorage.getItem('sothuchi_mic_granted') !== 'true') {
                    const granted = await requestMicrophoneAccess();
                    if (!granted) return;
                }
                try {
                    speechRecognitionInstance.start();
                } catch (e) {
                    console.error('Speech start error:', e);
                }
            }
        });

        // Nhận diện giọng nói cho nút [Nói] trong phần chi tiết
        if (btnSubVoiceRecord) {
            let isSubRecording = false;
            let subSpeechInstance = null;
            try {
                const SpeechRecCls = window.SpeechRecognition || window.webkitSpeechRecognition;
                if (SpeechRecCls) {
                    subSpeechInstance = new SpeechRecCls();
                    subSpeechInstance.continuous = false;
                    subSpeechInstance.interimResults = false;
                    subSpeechInstance.lang = 'vi-VN';

                    subSpeechInstance.onstart = () => {
                        isSubRecording = true;
                        btnSubVoiceRecord.classList.add('recording');
                        if (subVoiceText) subVoiceText.textContent = 'Đang nghe...';
                    };

                    subSpeechInstance.onresult = (event) => {
                        const transcript = event.results[0][0].transcript;
                        if (aiSubItemsInput) aiSubItemsInput.value = transcript;
                        applySubItemsSentence(transcript);
                    };

                    subSpeechInstance.onerror = (event) => {
                        console.error('Sub speech error:', event.error);
                        if (event.error === 'not-allowed') {
                            if (micIosInstructions) micIosInstructions.style.display = 'block';
                            micPermissionModal?.classList.add('active');
                            showToast('⚠️ Vui lòng cấp quyền Micro trong Cài đặt để nhận diện giọng nói!');
                        }
                    };

                    subSpeechInstance.onend = () => {
                        isSubRecording = false;
                        btnSubVoiceRecord.classList.remove('recording');
                        if (subVoiceText) subVoiceText.textContent = 'Nói';
                    };
                }
            } catch (e) {
                console.error('Failed to init sub speech:', e);
            }

            btnSubVoiceRecord.addEventListener('click', async () => {
                if (!subSpeechInstance) {
                    aiSubItemsInput?.focus();
                    return;
                }
                if (isSubRecording) {
                    subSpeechInstance.stop();
                } else {
                    if (localStorage.getItem('sothuchi_mic_granted') !== 'true') {
                        const granted = await requestMicrophoneAccess();
                        if (!granted) return;
                    }
                    try {
                        subSpeechInstance.start();
                    } catch (e) {
                        console.error('Sub speech start error:', e);
                    }
                }
            });
        }
    } else {
        if (btnVoiceRecord) {
            btnVoiceRecord.title = 'Trình duyệt không hỗ trợ Web Speech API trực tiếp';
            btnVoiceRecord.addEventListener('click', async () => {
                if (!navigator.onLine) {
                    if (isOfflineRecording) {
                        stopOfflineAudioRecording();
                    } else {
                        startOfflineAudioRecording();
                    }
                    return;
                }
                const granted = await requestMicrophoneAccess();
                if (granted) {
                    showToast('Bạn có thể gõ câu văn trực tiếp vào ô bên cạnh hoặc ghi âm ngoại tuyến!');
                }
                aiSentenceInput?.focus();
            });
        }
    }

    // ==================== OFFLINE AUDIO RECORDING & SỔ TẠM QUEUE ====================
    const btnHeaderOfflineRecord = document.getElementById('btnHeaderOfflineRecord');
    const headerOfflineMicIcon = document.getElementById('headerOfflineMicIcon');
    const offlineMemosBadgeCount = document.getElementById('offlineMemosBadgeCount');
    const btnMenuOfflineMemos = document.getElementById('btnMenuOfflineMemos');
    const menuMemosCountBadge = document.getElementById('menuMemosCountBadge');
    const offlineVoiceModal = document.getElementById('offlineVoiceModal');
    const closeOfflineVoiceModalBtn = document.getElementById('closeOfflineVoiceModalBtn');
    const btnCloseOfflineVoiceModal = document.getElementById('btnCloseOfflineVoiceModal');
    const offlineNetworkStatusTag = document.getElementById('offlineNetworkStatusTag');
    const offlineVoiceListContainer = document.getElementById('offlineVoiceListContainer');
    const btnRecordNewOfflineMemo = document.getElementById('btnRecordNewOfflineMemo');
    const offlineRecordingPill = document.getElementById('offlineRecordingPill');
    const offlineRecTimer = document.getElementById('offlineRecTimer');
    const btnStopOfflineRec = document.getElementById('btnStopOfflineRec');

    let offlineMediaRecorder = null;
    let offlineAudioChunks = [];
    let isOfflineRecording = false;
    let offlineRecStartTime = 0;
    let offlineRecTimerInterval = null;
    let offlineCurrentStream = null;

    // Real-time Speech Recognition for Offline Memos (Tự động chuyển giọng nói thành chữ ngay khi thu)
    let offlineSpeechRecognition = null;
    let liveRecognizedText = '';

    function initOfflineSpeechRec() {
        if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
            try {
                const SpeechRecCls = window.SpeechRecognition || window.webkitSpeechRecognition;
                offlineSpeechRecognition = new SpeechRecCls();
                offlineSpeechRecognition.continuous = true;
                offlineSpeechRecognition.interimResults = true;
                offlineSpeechRecognition.lang = 'vi-VN';

                offlineSpeechRecognition.onresult = (e) => {
                    let full = '';
                    for (let i = 0; i < e.results.length; i++) {
                        full += e.results[i][0].transcript + ' ';
                    }
                    liveRecognizedText = full.trim();
                    if (modalInlineRecText && isOfflineRecording) {
                        modalInlineRecText.textContent = `🎙️ "${liveRecognizedText}"`;
                    }
                };
                offlineSpeechRecognition.onerror = (e) => {
                    console.log('Offline speech rec note:', e.error);
                };
            } catch (e) {}
        }
    }
    initOfflineSpeechRec();

    async function updateOfflineMemosBadge() {
        if (typeof OfflineVoiceStorage === 'undefined') return;
        try {
            const count = await OfflineVoiceStorage.getPendingCount();
            if (offlineMemosBadgeCount) {
                if (count > 0) {
                    offlineMemosBadgeCount.textContent = count;
                    offlineMemosBadgeCount.style.display = 'flex';
                } else {
                    offlineMemosBadgeCount.style.display = 'none';
                }
            }
            if (menuMemosCountBadge) {
                if (count > 0) {
                    menuMemosCountBadge.textContent = count;
                    menuMemosCountBadge.style.display = 'inline-flex';
                } else {
                    menuMemosCountBadge.style.display = 'none';
                }
            }
        } catch (e) {}
    }

    function updateNetworkStatusDisplay() {
        const isOnline = navigator.onLine;
        if (offlineNetworkStatusTag) {
            offlineNetworkStatusTag.innerHTML = isOnline
                ? '<i class="fa-solid fa-wifi"></i> Online'
                : '<i class="fa-solid fa-plane"></i> Ngoại tuyến';
            offlineNetworkStatusTag.style.background = isOnline ? '#ecfdf5' : '#fef2f2';
            offlineNetworkStatusTag.style.color = isOnline ? '#059669' : '#dc2626';
        }
    }

    async function startOfflineAudioRecording() {
        if (isOfflineRecording) return;

        if (localStorage.getItem('sothuchi_mic_granted') !== 'true') {
            const granted = await requestMicrophoneAccess();
            if (!granted) return;
        }

        try {
            offlineCurrentStream = await navigator.mediaDevices.getUserMedia({ audio: true });
            let mimeType = 'audio/webm';
            if (typeof MediaRecorder !== 'undefined') {
                if (MediaRecorder.isTypeSupported && MediaRecorder.isTypeSupported('audio/webm;codecs=opus')) {
                    mimeType = 'audio/webm;codecs=opus';
                } else if (MediaRecorder.isTypeSupported && MediaRecorder.isTypeSupported('audio/mp4')) {
                    mimeType = 'audio/mp4';
                } else if (MediaRecorder.isTypeSupported && MediaRecorder.isTypeSupported('audio/aac')) {
                    mimeType = 'audio/aac';
                }
            }

            offlineMediaRecorder = new MediaRecorder(offlineCurrentStream, { mimeType });
            offlineAudioChunks = [];
            liveRecognizedText = '';

            // Bật song song nhận diện giọng nói tiếng Việt tức thì
            if (offlineSpeechRecognition) {
                try { offlineSpeechRecognition.start(); } catch (e) {}
            }

            offlineMediaRecorder.ondataavailable = (e) => {
                if (e.data && e.data.size > 0) {
                    offlineAudioChunks.push(e.data);
                }
            };

            offlineMediaRecorder.onstop = async () => {
                const duration = Math.max(1, Math.round((Date.now() - offlineRecStartTime) / 1000));
                const audioBlob = new Blob(offlineAudioChunks, { type: mimeType });
                
                if (offlineCurrentStream) {
                    offlineCurrentStream.getTracks().forEach(t => t.stop());
                    offlineCurrentStream = null;
                }

                if (audioBlob.size > 0 || offlineAudioChunks.length > 0) {
                    let base64Data = '';
                    try {
                        base64Data = await new Promise((resolve) => {
                            const reader = new FileReader();
                            reader.onloadend = () => resolve(reader.result || '');
                            reader.onerror = () => resolve('');
                            reader.readAsDataURL(audioBlob);
                        });
                    } catch (e) {}

                    const wsName = (State.onlineMode && SupabaseService.currentWorkspace) ? SupabaseService.currentWorkspace.name : 'Sổ Cá Nhân';
                    const wsId = (State.onlineMode && SupabaseService.currentWorkspace) ? SupabaseService.currentWorkspace.id : 'default';
                    
                    await OfflineVoiceStorage.saveMemo({
                        audioBlob: audioBlob,
                        audioBase64: base64Data,
                        mimeType: mimeType,
                        duration: duration,
                        text: liveRecognizedText || '',
                        workspaceId: wsId,
                        workspaceName: wsName,
                        targetType: txType?.value || 'expense'
                    });

                    showToast(`🎙️ Đã lưu bản ghi âm (${duration}s)!`);
                    await updateOfflineMemosBadge();
                    if (offlineVoiceModal?.classList.contains('active')) {
                        await renderOfflineMemosList();
                    }
                } else {
                    showToast('Bản ghi quá ngắn hoặc không có âm thanh.');
                }
            };

            offlineMediaRecorder.start(250);
            isOfflineRecording = true;
            offlineRecStartTime = Date.now();

            btnHeaderOfflineRecord?.classList.add('recording');
            if (modalInlineRecText) modalInlineRecText.textContent = '🔴 Đang ghi âm... Chạm để Dừng & Lưu';
            if (btnModalInlineRecord) btnModalInlineRecord.style.background = 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)';
            if (offlineRecordingPill) offlineRecordingPill.style.display = 'flex';
            if (offlineRecTimer) offlineRecTimer.textContent = '00:00';

            offlineRecTimerInterval = setInterval(() => {
                const sec = Math.round((Date.now() - offlineRecStartTime) / 1000);
                const m = String(Math.floor(sec / 60)).padStart(2, '0');
                const s = String(sec % 60).padStart(2, '0');
                if (offlineRecTimer) offlineRecTimer.textContent = `${m}:${s}`;
                if (modalInlineRecText && isOfflineRecording) {
                    if (liveRecognizedText) {
                        modalInlineRecText.textContent = `🔴 "${liveRecognizedText}"`;
                    } else {
                        modalInlineRecText.textContent = `🔴 Đang ghi âm: ${m}:${s} (Chạm để Dừng & Lưu)`;
                    }
                }
            }, 500);

            showToast('🎙️ Đang ghi âm ngoại tuyến... Hãy nói chi tiêu của bạn!');
        } catch (err) {
            console.error('startOfflineAudioRecording error:', err);
            showToast('⚠️ Không thể bật ghi âm micro: ' + err.message);
        }
    }

    function stopOfflineAudioRecording() {
        if (!isOfflineRecording || !offlineMediaRecorder) return;
        if (offlineSpeechRecognition) {
            try { offlineSpeechRecognition.stop(); } catch (e) {}
        }
        try {
            if (offlineMediaRecorder.state !== 'inactive') {
                try { offlineMediaRecorder.requestData(); } catch (e) {}
                offlineMediaRecorder.stop();
            }
        } catch (e) {}
        isOfflineRecording = false;
        btnHeaderOfflineRecord?.classList.remove('recording');
        if (modalInlineRecText) modalInlineRecText.textContent = 'Chạm vào đây để Thu Âm ngay';
        if (btnModalInlineRecord) btnModalInlineRecord.style.background = 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)';
        clearInterval(offlineRecTimerInterval);
        if (offlineRecordingPill) offlineRecordingPill.style.display = 'none';
    }

    // Bấm nút Micro trên Header: Ghi âm ngoại tuyến ngay lập tức 1 chạm!
    btnHeaderOfflineRecord?.addEventListener('click', (e) => {
        e.stopPropagation();
        if (isOfflineRecording) {
            stopOfflineAudioRecording();
        } else {
            startOfflineAudioRecording();
        }
    });

    // Bấm nút Thu Âm trực tiếp ngay trong Modal
    const btnModalInlineRecord = document.getElementById('btnModalInlineRecord');
    const modalInlineRecText = document.getElementById('modalInlineRecText');
    btnModalInlineRecord?.addEventListener('click', (e) => {
        e.stopPropagation();
        if (isOfflineRecording) {
            stopOfflineAudioRecording();
        } else {
            startOfflineAudioRecording();
        }
    });

    // Bấm vào huy hiệu số đếm màu tím: Mở ngay Sổ Tạm để xem/nghe lại và xử lý
    offlineMemosBadgeCount?.addEventListener('click', (e) => {
        e.stopPropagation();
        openOfflineVoiceModal();
    });

    btnStopOfflineRec?.addEventListener('click', () => {
        stopOfflineAudioRecording();
    });

    async function renderOfflineMemosList() {
        if (!offlineVoiceListContainer) return;
        updateNetworkStatusDisplay();
        const memos = await OfflineVoiceStorage.getAllMemos();

        if (!memos || memos.length === 0) {
            offlineVoiceListContainer.innerHTML = `
                <div class="offline-voice-empty">
                    <i class="fa-solid fa-circle-check"></i>
                    <p style="font-weight: 700; color: #1e293b; margin-bottom: 4px;">Sổ tạm trống</p>
                    <p style="font-size: 12px; color: #64748b;">Tất cả bản ghi âm đã được vào Sổ thành công!</p>
                </div>
            `;
            return;
        }

        offlineVoiceListContainer.innerHTML = memos.map(m => {
            const timeStr = Utils.formatDateTime(m.createdAt);
            const durStr = `${m.duration || 0}s`;
            let audioUrl = '';
            if (m.audioBlob instanceof Blob) {
                audioUrl = URL.createObjectURL(m.audioBlob);
            } else if (m.audioBase64) {
                audioUrl = m.audioBase64;
            }

            return `
                <div class="offline-voice-card" id="memoCard_${m.id}">
                    <div class="offline-voice-top-row">
                        <div class="offline-voice-time">
                            <i class="fa-solid fa-clock" style="color: #64748b;"></i>
                            <span>${timeStr}</span>
                            <span style="font-size: 10.5px; color: #64748b; margin-left: 4px;">(${m.workspaceName || 'Sổ'})</span>
                        </div>
                        <span class="offline-voice-duration-tag">⏱️ ${durStr}</span>
                    </div>

                    ${audioUrl ? `
                        <div class="offline-voice-player-wrap">
                            <audio controls class="offline-voice-audio-element" src="${audioUrl}"></audio>
                        </div>
                    ` : `<div style="font-size: 11px; color: #94a3b8;">Bản ghi không có file âm thanh.</div>`}

                    <!-- Ô nhập / Sửa trực tiếp nội dung chi tiêu -->
                    <div class="offline-voice-input-row" style="display: flex; gap: 6px; align-items: center; margin-top: 2px;">
                        <input type="text" id="memoInput_${m.id}" class="memo-inline-edit-input" value="${m.text || ''}" placeholder="✍️ Gõ/sửa nội dung (vd: cơm trưa 35k, xăng 50k)..." oninput="handleSaveMemoText('${m.id}', this.value)" style="flex: 1; padding: 7px 10px; border-radius: 6px; border: 1px solid #cbd5e1; font-size: 12px; outline: none; background: #ffffff;">
                    </div>

                    <div class="offline-voice-actions-row" style="display: flex; gap: 8px; margin-top: 2px;">
                        <button type="button" class="btn-memo-process-now" onclick="handleProcessMemo('${m.id}')" title="Xử lý ghi âm này vào Sổ">
                            <i class="fa-solid fa-bolt"></i> <span>Xử lý</span>
                        </button>
                        <button type="button" class="btn-memo-delete" onclick="handleDeleteMemo('${m.id}')" title="Xóa bản ghi này">
                            <i class="fa-solid fa-trash"></i>
                        </button>
                    </div>
                </div>
            `;
        }).join('');
    }

    window.handleSaveMemoText = (memoId, text) => {
        OfflineVoiceStorage.updateMemoText(memoId, text);
    };

    window.handleDeleteMemo = async (memoId) => {
        const res = await showCustomConfirm({
            title: 'Xóa Bản Ghi?',
            message: 'Bạn có chắc chắn muốn xóa bản ghi âm này không?',
            okText: 'Xóa',
            okColor: '#dc2626'
        });
        if (res && res.confirmed) {
            await OfflineVoiceStorage.deleteMemo(memoId);
            const card = document.getElementById(`memoCard_${memoId}`);
            if (card) {
                card.style.transition = 'all 0.2s ease';
                card.style.opacity = '0';
                card.style.transform = 'scale(0.95)';
                setTimeout(() => card.remove(), 200);
            }
            showToast('Đã xóa bản ghi âm thành công!');
            await updateOfflineMemosBadge();
            setTimeout(async () => {
                await renderOfflineMemosList();
            }, 220);
        }
    };

    // ==================== GOOGLE GEMINI AUDIO SERVICE ====================
    async function callGeminiGenerateContent(apiKey, bodyPayload) {
        // Danh sách model đa thế hệ ưu tiên cao nhất của Google
        const candidateModels = [
            'gemini-2.5-flash',
            'gemini-1.5-flash',
            'gemini-2.5-flash-lite',
            'gemini-3.6-flash',
            'gemini-1.5-pro'
        ];
        let lastError = null;

        for (const model of candidateModels) {
            try {
                const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(bodyPayload)
                });
                const data = await response.json();
                if (data.error) {
                    const errMsg = data.error.message || '';
                    if (errMsg.toLowerCase().includes('api key') || errMsg.toLowerCase().includes('api_key') || data.error.code === 403) {
                        throw new Error('API Key không hợp lệ hoặc đã hết hạn');
                    }
                    lastError = new Error(errMsg);
                    continue;
                }
                return data;
            } catch (err) {
                lastError = err;
                if (err.message && err.message.includes('API Key')) {
                    throw err;
                }
                continue;
            }
        }
        throw lastError || new Error('Không thể kết nối với mô hình Google Gemini');
    }

    const GeminiAudioService = {
        async transcribeAndParseAudio(audioBase64, mimeType = 'audio/webm', apiKey) {
            if (!apiKey) throw new Error('Chưa cấu hình Gemini API Key');

            let cleanBase64 = audioBase64;
            if (cleanBase64.includes(';base64,')) {
                cleanBase64 = cleanBase64.split(';base64,')[1];
            }

            let audioMime = mimeType || 'audio/webm';
            if (audioMime.includes(';')) audioMime = audioMime.split(';')[0].trim();
            if (!audioMime.startsWith('audio/')) audioMime = 'audio/webm';

            const prompt = `Bạn là trợ lý tài chính thông minh tiếng Việt. Hãy nghe đoạn ghi âm giọng nói này và bóc tách thành đối tượng JSON chính xác theo cấu trúc sau:
{
  "text": "câu nói tiếng Việt nguyên văn bạn nghe được (ví dụ: đổ xăng 50k, cơm tấm 35 ngàn, thu tiền thưởng 2 triệu)",
  "type": "expense" hoặc "income",
  "amount": số tiền dạng số nguyên dương (ví dụ: 50000, 35000, 2000000),
  "note": "tên món hoặc lý do chi tiêu ngắn gọn (ví dụ: Đổ xăng xe, Cơm tấm sườn)"
}
Quy tắc:
- Nhận diện đúng số tiền kể cả nói tắt (k = nghìn/ngàn, củ/tr = triệu, lốp/xị = trăm ngàn).
- Nếu là thu tiền/lương/thưởng/đòi nợ -> type: "income", còn lại mặc định -> type: "expense".
- Chỉ trả về duy nhất chuỗi JSON hợp lệ, không bọc markdown \`\`\`json hay giải thích gì thêm.`;

            const data = await callGeminiGenerateContent(apiKey, {
                contents: [{
                    parts: [
                        {
                            inlineData: {
                                mimeType: audioMime,
                                data: cleanBase64
                            }
                        },
                        { text: prompt }
                    ]
                }],
                generationConfig: {
                    responseMimeType: "application/json"
                }
            });

            const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text;
            if (!rawText) throw new Error('Không nhận được phản hồi từ Gemini AI');

            try {
                const cleanJson = rawText.replace(/```json/gi, '').replace(/```/g, '').trim();
                const parsed = JSON.parse(cleanJson);
                if (typeof parsed.amount === 'string') {
                    parsed.amount = parseInt(parsed.amount.replace(/\D/g, ''), 10) || 0;
                }
                return parsed;
            } catch (e) {
                console.error('Parse Gemini JSON error:', rawText);
                throw new Error('Lỗi cấu trúc dữ liệu JSON từ AI: ' + rawText);
            }
        }
    };

    window.handleProcessMemo = async (memoId) => {
        const memos = await OfflineVoiceStorage.getAllMemos();
        const target = memos.find(m => m.id === memoId);
        if (!target) return;

        const inputEl = document.getElementById('memoInput_' + memoId);
        const inputVal = inputEl?.value?.trim() || target.text || '';

        // Trường hợp 1: Nếu người dùng đã có nội dung văn bản -> Vào sổ tức thì 1 chạm (0.01 giây)
        if (inputVal) {
            const parsed = Utils.parseNaturalSentence(inputVal);
            if (parsed && parsed.amount > 0) {
                const txData = {
                    type: parsed.type || target.targetType || 'expense',
                    amount: parsed.amount,
                    categoryId: parsed.categoryId || 'cat_other',
                    note: parsed.note || inputVal,
                    date: target.createdAt || new Date().toISOString()
                };

                await saveTransactionUniversal(txData);

                await OfflineVoiceStorage.deleteMemo(memoId);
                await updateOfflineMemosBadge();
                await renderOfflineMemosList();
                await loadTransactionsData();
                showToast(`✅ Đã vào sổ 1 chạm: [${parsed.type === 'income' ? 'Thu' : 'Chi'}] ${Utils.formatCurrency(parsed.amount)} - ${parsed.note}`);
                return;
            }
        }

        // Trường hợp 2: Ô chữ trống nhưng có File Âm Thanh + Đã Cài Gemini API Key
        const geminiApiKey = (localStorage.getItem('sothuchi_gemini_api_key') || '').trim();
        const processBtn = document.querySelector(`#memoCard_${memoId} .btn-memo-process-now`);
        
        if (geminiApiKey && (target.audioBase64 || target.audioBlob) && navigator.onLine) {
            let originalBtnHtml = '';
            if (processBtn) {
                originalBtnHtml = processBtn.innerHTML;
                processBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> <span>Gemini đang nghe...</span>';
                processBtn.disabled = true;
            }

            try {
                // Chuẩn bị Base64 âm thanh
                let base64 = target.audioBase64 || '';
                if (!base64 && target.audioBlob instanceof Blob) {
                    base64 = await new Promise((resolve) => {
                        const reader = new FileReader();
                        reader.onloadend = () => resolve(reader.result || '');
                        reader.onerror = () => resolve('');
                        reader.readAsDataURL(target.audioBlob);
                    });
                }

                if (!base64) {
                    throw new Error('Không tìm thấy dữ liệu âm thanh');
                }

                // Gọi Gemini AI
                const aiResult = await GeminiAudioService.transcribeAndParseAudio(base64, target.mimeType, geminiApiKey);
                
                if (aiResult && aiResult.amount > 0) {
                    let matchedCatId = aiResult.type === 'income' ? 'cat_income_other' : 'cat_food';
                    try {
                        if (typeof Utils.predictCategoryId === 'function') {
                            matchedCatId = Utils.predictCategoryId(aiResult.text || aiResult.note, aiResult.type);
                        } else if (typeof Utils.predictCategory === 'function') {
                            const pred = Utils.predictCategory(aiResult.text || aiResult.note, aiResult.type);
                            if (pred && pred.categoryId) matchedCatId = pred.categoryId;
                        }
                    } catch (e) {}
                    const txData = {
                        type: aiResult.type || target.targetType || 'expense',
                        amount: aiResult.amount,
                        categoryId: matchedCatId,
                        note: aiResult.note || aiResult.text || 'Ghi âm offline',
                        date: target.createdAt || new Date().toISOString()
                    };

                    await saveTransactionUniversal(txData);

                    await OfflineVoiceStorage.deleteMemo(memoId);
                    await updateOfflineMemosBadge();
                    await renderOfflineMemosList();
                    await loadTransactionsData();
                    showToast(`🤖 Gemini AI đã nghe & lưu: [${txData.type === 'income' ? 'Thu' : 'Chi'}] ${Utils.formatCurrency(txData.amount)} - ${txData.note}`);
                    return;
                } else {
                    if (aiResult && aiResult.text && inputEl) {
                        inputEl.value = aiResult.text;
                        OfflineVoiceStorage.updateMemoText(memoId, aiResult.text);
                    }
                    throw new Error('AI chưa nhận diện được số tiền');
                }
            } catch (err) {
                console.warn('Gemini Audio Error:', err);
                showToast(`💡 ${err.message || 'Không thể dịch âm thanh'}. Hãy gõ nội dung (vd: cơm 35k) vào ô rồi bấm Xử lý!`);
                if (inputEl) {
                    inputEl.focus();
                    inputEl.style.borderColor = '#2563eb';
                    inputEl.style.boxShadow = '0 0 0 3px rgba(37, 99, 235, 0.15)';
                }
                return;
            } finally {
                if (processBtn) {
                    processBtn.innerHTML = originalBtnHtml;
                    processBtn.disabled = false;
                }
            }
            return;
        }

        // Trường hợp 3: Ô chữ trống -> Giữ nguyên cửa sổ và gợi ý người dùng gõ nhanh
        showToast('💡 Bạn hãy gõ nhanh nội dung (vd: cơm 35k, xăng 50k) vào ô rồi bấm Xử lý!');
        if (inputEl) {
            inputEl.focus();
            inputEl.style.borderColor = '#2563eb';
            inputEl.style.boxShadow = '0 0 0 3px rgba(37, 99, 235, 0.15)';
        }
    };

    function openOfflineVoiceModal() {
        offlineVoiceModal?.classList.add('active');
        updateGeminiStatusUI();
        renderOfflineMemosList();
    }

    window.openOfflineVoiceModal = openOfflineVoiceModal;
    window.renderOfflineMemosList = renderOfflineMemosList;

    function closeOfflineVoiceModal() {
        offlineVoiceModal?.classList.remove('active');
    }

    btnMenuOfflineMemos?.addEventListener('click', () => {
        document.getElementById('settingsMenuPopup')?.classList.remove('active');
        openOfflineVoiceModal();
    });
    closeOfflineVoiceModalBtn?.addEventListener('click', closeOfflineVoiceModal);
    btnCloseOfflineVoiceModal?.addEventListener('click', closeOfflineVoiceModal);
    offlineVoiceModal?.addEventListener('click', (e) => {
        if (e.target === offlineVoiceModal) closeOfflineVoiceModal();
    });

    btnRecordNewOfflineMemo?.addEventListener('click', () => {
        closeOfflineVoiceModal();
        startOfflineAudioRecording();
    });

    // Lắng nghe sự kiện online / offline của mạng
    window.addEventListener('online', async () => {
        updateNetworkStatusDisplay();
        showToast('🌐 Đã kết nối mạng Internet trở lại!');

        // Tự động đồng bộ an toàn các giao dịch đã lưu khi offline lên Supabase
        await syncPendingOfflineTransactions();
        await loadTransactionsData();

        const count = await OfflineVoiceStorage.getPendingCount();
        if (count > 0) {
            showToast(`🎙️ Bạn có ${count} bản ghi âm ngoại tuyến trong Sổ Tạm cần xử lý.`);
        }
        await updateOfflineMemosBadge();
    });

    window.addEventListener('offline', () => {
        updateNetworkStatusDisplay();
        showToast('📡 Đang ngoại tuyến (Mất mạng). Giao dịch sẽ lưu vào máy và tự đồng bộ khi có mạng!');
    });

    // Khởi tạo kiểm tra badge khi tải trang
    setTimeout(() => {
        updateOfflineMemosBadge();
    }, 1500);

    openIncomeModalBtn?.addEventListener('click', () => openModalForNew('income'));
    openExpenseModalBtn?.addEventListener('click', () => openModalForNew('expense'));

    document.getElementById('mobileOpeningBalanceTag')?.addEventListener('click', promptSetOpeningBalance);
    document.getElementById('btnEditOpeningBalanceDesktop')?.addEventListener('click', promptSetOpeningBalance);
    // ==================== GEMINI AI CONFIG MODAL CONTROLLER ====================
    const GeminiService = {
        async testApiKey(apiKey) {
            if (!apiKey) return { success: false, message: 'Chưa nhập API Key' };
            try {
                await callGeminiGenerateContent(apiKey, {
                    contents: [{ parts: [{ text: "Xin chào" }] }]
                });
                return { success: true };
            } catch (err) {
                return { success: false, message: err.message || 'Không thể kết nối tới Google' };
            }
        }
    };

    const geminiConfigModal = document.getElementById('geminiConfigModal');
    const geminiApiKeyInput = document.getElementById('geminiApiKeyInput');
    const btnOpenGeminiConfigModal = document.getElementById('btnOpenGeminiConfigModal');
    const closeGeminiModalBtn = document.getElementById('closeGeminiModalBtn');
    const btnCancelGeminiModal = document.getElementById('btnCancelGeminiModal');
    const btnSaveGeminiKey = document.getElementById('btnSaveGeminiKey');
    const btnRemoveGeminiKey = document.getElementById('btnRemoveGeminiKey');
    const btnToggleGeminiKey = document.getElementById('btnToggleGeminiKey');
    const geminiKeyEyeIcon = document.getElementById('geminiKeyEyeIcon');
    const geminiTestStatusBox = document.getElementById('geminiTestStatusBox');
    const badgeGeminiStatus = document.getElementById('badgeGeminiStatus');
    const geminiVoiceStatusBadge = document.getElementById('geminiVoiceStatusBadge');

    function updateGeminiStatusUI() {
        const key = (localStorage.getItem('sothuchi_gemini_api_key') || '').trim();
        if (badgeGeminiStatus) {
            badgeGeminiStatus.textContent = key ? '✓ Đã Bật' : 'Key';
            badgeGeminiStatus.style.background = key ? '#ecfdf5' : '#ede9fe';
            badgeGeminiStatus.style.color = key ? '#059669' : '#7c3aed';
        }
        if (geminiVoiceStatusBadge) {
            if (key) {
                geminiVoiceStatusBadge.innerHTML = '<i class="fa-solid fa-wand-magic-sparkles" style="color: #10b981;"></i> <span style="color: #059669;">Gemini AI: Bật</span>';
            } else {
                geminiVoiceStatusBadge.innerHTML = '<i class="fa-solid fa-wand-magic-sparkles" style="color: #8b5cf6;"></i> <span style="color: #7c3aed; text-decoration: underline;">Cài đặt Gemini AI</span>';
            }
        }
        if (btnRemoveGeminiKey) {
            btnRemoveGeminiKey.style.display = key ? 'inline-block' : 'none';
        }
    }

    function openGeminiConfigModal() {
        if (!geminiConfigModal) return;
        geminiConfigModal.classList.add('active');
        const key = localStorage.getItem('sothuchi_gemini_api_key') || '';
        if (geminiApiKeyInput) geminiApiKeyInput.value = key;
        if (geminiTestStatusBox) {
            geminiTestStatusBox.style.display = 'none';
            geminiTestStatusBox.textContent = '';
        }
        updateGeminiStatusUI();
    }

    window.openGeminiConfigModal = openGeminiConfigModal;

    function closeGeminiConfigModal() {
        geminiConfigModal?.classList.remove('active');
    }

    btnOpenGeminiConfigModal?.addEventListener('click', () => {
        document.getElementById('settingsMenuPopup')?.classList.remove('active');
        openGeminiConfigModal();
    });

    geminiVoiceStatusBadge?.addEventListener('click', () => {
        openGeminiConfigModal();
    });

    closeGeminiModalBtn?.addEventListener('click', closeGeminiConfigModal);
    btnCancelGeminiModal?.addEventListener('click', closeGeminiConfigModal);

    btnToggleGeminiKey?.addEventListener('click', () => {
        if (!geminiApiKeyInput) return;
        if (geminiApiKeyInput.type === 'password') {
            geminiApiKeyInput.type = 'text';
            if (geminiKeyEyeIcon) geminiKeyEyeIcon.className = 'fa-solid fa-eye-slash';
        } else {
            geminiApiKeyInput.type = 'password';
            if (geminiKeyEyeIcon) geminiKeyEyeIcon.className = 'fa-solid fa-eye';
        }
    });

    btnSaveGeminiKey?.addEventListener('click', async () => {
        const key = geminiApiKeyInput?.value?.trim() || '';
        if (!key) {
            showToast('⚠️ Vui lòng nhập hoặc dán Google Gemini API Key!');
            return;
        }

        if (geminiTestStatusBox) {
            geminiTestStatusBox.style.display = 'block';
            geminiTestStatusBox.style.background = '#f1f5f9';
            geminiTestStatusBox.style.color = '#334155';
            geminiTestStatusBox.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Đang kiểm tra API Key với Google...';
        }

        const testRes = await GeminiService.testApiKey(key);
        if (testRes.success) {
            localStorage.setItem('sothuchi_gemini_api_key', key);
            updateGeminiStatusUI();
            if (geminiTestStatusBox) {
                geminiTestStatusBox.style.background = '#ecfdf5';
                geminiTestStatusBox.style.color = '#059669';
                geminiTestStatusBox.innerHTML = '✅ Kết nối Google Gemini thành công 100%! Đã kích hoạt tính năng tự động nghe giọng nói.';
            }
            showToast('🎉 Đã kích hoạt Google Gemini AI thành công!');
            setTimeout(() => {
                closeGeminiConfigModal();
            }, 1200);
        } else {
            if (geminiTestStatusBox) {
                geminiTestStatusBox.style.background = '#fef2f2';
                geminiTestStatusBox.style.color = '#dc2626';
                geminiTestStatusBox.innerHTML = `❌ Lỗi: ${testRes.message}. Hãy kiểm tra lại API Key.`;
            }
        }
    });

    btnRemoveGeminiKey?.addEventListener('click', async () => {
        const res = await showCustomConfirm({
            title: 'Xóa Gemini API Key?',
            message: 'Bạn có chắc chắn muốn gỡ bỏ API Key này khỏi thiết bị?',
            okText: 'Xóa',
            okColor: '#dc2626'
        });
        if (res && res.confirmed) {
            localStorage.removeItem('sothuchi_gemini_api_key');
            if (geminiApiKeyInput) geminiApiKeyInput.value = '';
            updateGeminiStatusUI();
            showToast('Đã xóa Gemini API Key khỏi thiết bị');
            closeGeminiConfigModal();
        }
    });

    updateGeminiStatusUI();

    document.getElementById('btnMenuSetOpeningBalance')?.addEventListener('click', () => {
        document.getElementById('settingsMenuPopup')?.classList.remove('active');
        promptSetOpeningBalance();
    });

    document.getElementById('closeModalBtn')?.addEventListener('click', closeModal);
    txModal?.addEventListener('click', (e) => {
        if (e.target === txModal) closeModal();
    });

    document.querySelectorAll('.tab-type-btn').forEach(btn => {
        btn.addEventListener('click', () => setModalType(btn.dataset.type));
    });

    document.querySelectorAll('.chip-btn:not(.chip-clear)').forEach(chip => {
        chip.addEventListener('click', () => {
            const add = Number(chip.dataset.add) || 0;
            const current = Utils.parseInputAmount(txAmount.value) || 0;
            txAmount.value = (current + add).toLocaleString('vi-VN');
        });
    });

    document.getElementById('chipClearBtn')?.addEventListener('click', () => {
        txAmount.value = '';
    });

    txAmount?.addEventListener('input', (e) => {
        const val = e.target.value;
        if (val.toLowerCase().endsWith('k') || val.toLowerCase().endsWith('tr') || val.toLowerCase().endsWith('m')) return;
        const clean = val.replace(/[^0-9]/g, '');
        if (clean) e.target.value = parseInt(clean, 10).toLocaleString('vi-VN');
    });

    txAmount?.addEventListener('blur', (e) => {
        const parsed = Utils.parseInputAmount(e.target.value);
        if (parsed > 0) e.target.value = parsed.toLocaleString('vi-VN');
    });

    txForm?.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        // Nếu người dùng vừa gõ câu AI mà chưa bóc tách số tiền
        if (aiSentenceInput && aiSentenceInput.value.trim() && (!txAmount.value || Utils.parseInputAmount(txAmount.value) <= 0)) {
            applyParsedSentence(aiSentenceInput.value.trim());
        }

        const id = txId.value;
        const type = txType.value;
        const amount = Utils.parseInputAmount(txAmount.value);
        const categoryId = txCategory.value;
        const note = txNote.value.trim();
        const date = Utils.toIsoString(txDate.value);
        const sub_items = currentModalSubItems.filter(it => (it.name && it.name.trim()) || (Number(it.amount) || 0) > 0);

        if (amount <= 0 || !note) {
            showToast('⚠️ Vui lòng nhập số tiền và nội dung ghi chú!');
            return;
        }

        // Tự học ký ức cá nhân cho ghi chú chính và các món con
        Utils.savePersonalLearning(note, categoryId, type);
        sub_items.forEach(sub => {
            if (sub.name && sub.categoryId) {
                Utils.savePersonalLearning(sub.name, sub.categoryId, type);
            }
        });

        try {
            if (id) {
                if (State.onlineMode && SupabaseService.client && SupabaseService.currentWorkspace) {
                    await SupabaseService.updateTransaction(id, { type, amount, note, date, category_id: categoryId, sub_items });
                } else {
                    AppData.updateTransaction(id, { type, amount, note, date, categoryId, sub_items });
                }
                showToast('Đã cập nhật!');
            } else {
                await saveTransactionUniversal({ type, amount, note, date, categoryId, category_id: categoryId, sub_items });
                showToast(`Đã thêm: ${type === 'income' ? '+' : '-'}${Utils.formatCurrency(amount)}`);
            }
            closeModal();
        } catch (err) {
            showToast('⚠️ Lỗi: ' + (err.message || 'Không thể lưu giao dịch'));
        }
    });

    // ==================== PAGINATION CONTROLS ====================
    btnPrevPage?.addEventListener('click', () => {
        if (State.currentPage > 1) {
            State.currentPage--;
            render();
        }
    });

    btnNextPage?.addEventListener('click', () => {
        State.currentPage++;
        render();
    });

    rowsPerPageSelect?.addEventListener('change', (e) => {
        State.rowsPerPage = Number(e.target.value) || 10;
        State.currentPage = 1;
        render();
    });

    // ==================== MOBILE LAZY LOAD / INFINITE SCROLL ====================
    let isMobileLoadingMore = false;

    function handleMobileInfiniteScroll() {
        if (window.innerWidth > 768) return;
        if (isMobileLoadingMore) return;

        const scrollPosition = window.innerHeight + window.scrollY;
        const threshold = document.documentElement.scrollHeight - 250;

        if (scrollPosition >= threshold) {
            const fullList = getTableFilteredList();
            if (State.mobileVisibleCount < fullList.length) {
                isMobileLoadingMore = true;
                State.mobileVisibleCount += 10;
                render();
                setTimeout(() => { isMobileLoadingMore = false; }, 250);
            }
        }
    }

    window.addEventListener('scroll', handleMobileInfiniteScroll, { passive: true });

    // Tự động chuyển đổi giữa giao diện mobile lazyload và desktop pagination khi thay đổi kích thước
    window.addEventListener('resize', () => {
        render();
    });

    // ==================== AUTH MODAL LOGIC ====================
    let authMode = 'login';
    const linkForgotPassword = document.getElementById('linkForgotPassword');
    const backToLoginLink = document.getElementById('backToLoginLink');
    const authPasswordGroup = document.getElementById('authPasswordGroup');
    const forgotHelpText = document.getElementById('forgotHelpText');

    function setAuthMode(mode) {
        authMode = mode;
        tabModeLogin?.classList.remove('active');
        tabModeSignup?.classList.remove('active');

        if (mode === 'login') {
            tabModeLogin?.classList.add('active');
            if (authPasswordGroup) authPasswordGroup.style.display = 'block';
            if (forgotHelpText) forgotHelpText.style.display = 'none';
            if (authPasswordInput) authPasswordInput.required = true;
            btnAuthSubmitText.textContent = 'Đăng Nhập';
        } else if (mode === 'signup') {
            tabModeSignup?.classList.add('active');
            if (authPasswordGroup) authPasswordGroup.style.display = 'block';
            if (forgotHelpText) forgotHelpText.style.display = 'none';
            if (authPasswordInput) authPasswordInput.required = true;
            btnAuthSubmitText.textContent = 'Đăng Ký';
        } else if (mode === 'forgot') {
            if (authPasswordGroup) authPasswordGroup.style.display = 'none';
            if (forgotHelpText) forgotHelpText.style.display = 'block';
            if (authPasswordInput) authPasswordInput.required = false;
            btnAuthSubmitText.textContent = 'Gửi liên kết khôi phục';
        }
    }

    tabModeLogin?.addEventListener('click', () => setAuthMode('login'));
    tabModeSignup?.addEventListener('click', () => setAuthMode('signup'));
    linkForgotPassword?.addEventListener('click', () => setAuthMode('forgot'));
    backToLoginLink?.addEventListener('click', () => setAuthMode('login'));

    btnTogglePassword?.addEventListener('click', () => {
        if (authPasswordInput.type === 'password') {
            authPasswordInput.type = 'text';
            pwdEyeIcon.className = 'fa-solid fa-eye-slash';
        } else {
            authPasswordInput.type = 'password';
            pwdEyeIcon.className = 'fa-solid fa-eye';
        }
    });

    btnOpenAuthModal?.addEventListener('click', () => {
        settingsMenuPopup?.classList.remove('active');
        setAuthMode('login');
        if (authEmailInput) authEmailInput.value = '';
        if (authPasswordInput) authPasswordInput.value = '';
        authModal?.classList.add('active');
        setTimeout(() => authEmailInput?.focus(), 150);
    });

    closeAuthModalBtn?.addEventListener('click', () => authModal?.classList.remove('active'));
    authModal?.addEventListener('click', (e) => {
        if (e.target === authModal) authModal?.classList.remove('active');
    });

    emailAuthForm?.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = authEmailInput.value.trim();
        const password = authPasswordInput.value;

        if (!email) {
            showToast('⚠️ Vui lòng nhập địa chỉ email của bạn!');
            return;
        }

        try {
            if (authMode === 'forgot') {
                btnAuthSubmitText.textContent = 'Đang gửi yêu cầu...';
                await SupabaseService.resetPasswordForEmail(email);
                showToast(`✅ Đã gửi liên kết khôi phục mật khẩu tới email "${email}"!`);
                setAuthMode('login');
                btnAuthSubmitText.textContent = 'Đăng Nhập Ngay';
                return;
            }

            if (!password || password.length < 4) {
                showToast('⚠️ Vui lòng nhập mật khẩu (từ 4 ký tự)!');
                return;
            }

            btnAuthSubmitText.textContent = 'Đang xử lý...';
            if (authMode === 'login') {
                const user = await SupabaseService.loginWithEmail(email, password);
                showToast(`Đăng nhập thành công! Xin chào ${user.email}`);
                authModal?.classList.remove('active');
                await onAuthStateChanged(user, SupabaseService.currentRole, SupabaseService.currentWorkspace);
            } else {
                const user = await SupabaseService.signupWithEmail(email, password);
                showToast('Tạo tài khoản và đăng nhập thành công!');
                authModal?.classList.remove('active');
                await onAuthStateChanged(user || SupabaseService.currentUser, SupabaseService.currentRole, SupabaseService.currentWorkspace);
            }
        } catch (err) {
            console.error('Auth submit error:', err);
            let msg = err.message || 'Lỗi xử lý xác thực';
            if (msg.includes('Invalid login credentials')) msg = 'Sai email hoặc mật khẩu. Vui lòng kiểm tra lại!';
            else if (msg.includes('User already registered')) msg = 'Email này đã tồn tại tài khoản. Bạn có thể bấm Đăng Nhập hoặc Quên Mật Khẩu!';
            showToast('⚠️ ' + msg);
            setAuthMode(authMode);
        }
    });

    btnGoogleLogin?.addEventListener('click', async () => {
        try {
            await SupabaseService.loginWithGoogle();
        } catch (err) {
            showToast('⚠️ Lỗi đăng nhập Google: ' + err.message);
        }
    });

    btnLogout?.addEventListener('click', async () => {
        settingsMenuPopup?.classList.remove('active');
        const res = await showCustomConfirm({
            title: 'Đăng Xuất?',
            message: 'Bạn có chắc chắn muốn đăng xuất khỏi tài khoản?',
            okText: 'Đăng Xuất',
            okColor: '#2563eb',
            icon: 'fa-solid fa-right-from-bracket',
            iconBg: '#eff6ff',
            iconColor: '#2563eb',
            requireReason: false
        });
        if (res && res.confirmed) {
            await SupabaseService.logout();
            showToast('Đã đăng xuất thành công!');
            onAuthStateChanged(null);
        }
    });

    // ==================== WORKSPACE (SỔ) & MEMBERS & LOGS ====================
    workspaceSelect?.addEventListener('change', async (e) => {
        const wsId = e.target.value;
        if (!wsId || wsId === 'local') return;
        SupabaseService.switchWorkspace(wsId);
        await loadTransactionsData();
    });

    btnOpenCreateWsModal?.addEventListener('click', () => {
        settingsMenuPopup?.classList.remove('active');
        document.getElementById('newWsName').value = '';
        document.getElementById('createWsModal').classList.add('active');
    });

    document.getElementById('closeCreateWsModalBtn')?.addEventListener('click', () => document.getElementById('createWsModal').classList.remove('active'));
    document.getElementById('btnCancelCreateWs')?.addEventListener('click', () => document.getElementById('createWsModal').classList.remove('active'));

    document.getElementById('createWsForm')?.addEventListener('submit', async (e) => {
        e.preventDefault();
        const name = document.getElementById('newWsName').value.trim();
        if (!name) return;

        try {
            await SupabaseService.createWorkspace(name);
            showToast(`Đã tạo sổ mới: "${name}"`);
            document.getElementById('createWsModal').classList.remove('active');
            renderWorkspaceDropdown();
            await loadTransactionsData();
        } catch (err) {
            showToast('⚠️ Lỗi tạo sổ: ' + err.message);
        }
    });

    // ==================== QUẢN LÝ THÀNH VIÊN (MEMBERS) ====================
    btnOpenMembersModal?.addEventListener('click', async () => {
        settingsMenuPopup?.classList.remove('active');
        if (!State.onlineMode) {
            showToast('Vui lòng đăng nhập để sử dụng tính năng quản lý thành viên & phân quyền!');
            authModal?.classList.add('active');
            return;
        }
        const wsSub = document.getElementById('membersModalWsName');
        if (wsSub) wsSub.textContent = `Sổ hiện tại: ${SupabaseService.currentWorkspace?.name || 'Home'}`;

        await renderMembersList();
        document.getElementById('membersModal').classList.add('active');
    });

    document.getElementById('closeMembersModalBtn')?.addEventListener('click', () => {
        document.getElementById('membersModal').classList.remove('active');
    });

    async function renderMembersList() {
        const wsSub = document.getElementById('membersModalWsName');
        if (wsSub) wsSub.textContent = `Sổ hiện tại: ${SupabaseService.currentWorkspace?.name || 'Home'}`;

        const membersListTbody = document.getElementById('membersTableBody') || document.getElementById('membersListTbody');
        if (!membersListTbody) return;
        membersListTbody.innerHTML = '<tr><td colspan="4" style="text-align:center; padding:16px;">Đang tải danh sách thành viên...</td></tr>';
        
        try {
            const members = await SupabaseService.fetchMembers();
            if (!members || members.length === 0) {
                membersListTbody.innerHTML = '<tr><td colspan="4" style="text-align:center; padding:16px;">Chưa có thành viên nào khác trong sổ này.</td></tr>';
                return;
            }
            membersListTbody.innerHTML = members.map(m => {
                const isMe = m.user_id === SupabaseService.currentUser?.id;
                const roleBadge = m.role === 'owner' ? '👑 Owner' : (m.role === 'admin' ? '⭐ Admin' : '✍️ Ghi chép');
                const statusTag = m.status === 'pending' ? ' <span style="font-size:10px; color:#f59e0b; background:#fef3c7; padding:2px 6px; border-radius:4px;">(Đang chờ nhận)</span>' : '';
                const canDelete = (State.userRole === 'owner' || State.userRole === 'admin') && !isMe && m.role !== 'owner';

                return `
                    <tr>
                        <td>
                            <div class="member-user-cell">
                                <div class="member-avatar-mini">${(m.profiles?.full_name || m.user_email || 'U')[0].toUpperCase()}</div>
                                <div>
                                    <div style="font-weight:700;">${m.profiles?.full_name || m.user_email} ${isMe ? '(Bạn)' : ''}${statusTag}</div>
                                    <div style="font-size:11px; color:var(--text-muted);">${m.user_email || ''}</div>
                                </div>
                            </div>
                        </td>
                        <td><span class="role-pill">${roleBadge}</span></td>
                        <td><span style="font-size:12px; color:var(--text-muted);">${m.created_at ? new Date(m.created_at).toLocaleDateString('vi-VN') : '---'}</span></td>
                        <td>
                            ${canDelete ? `<button class="btn-icon-table btn-del-table" onclick="handleRemoveMember('${m.id}')" title="Xóa thành viên"><i class="fa-solid fa-trash"></i></button>` : ''}
                        </td>
                    </tr>
                `;
            }).join('');
        } catch (e) {
            membersListTbody.innerHTML = `<tr><td colspan="4" style="text-align:center; color:red; padding:16px;">Lỗi tải thành viên: ${e.message}</td></tr>`;
        }
    }

    document.getElementById('inviteMemberForm')?.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('inviteEmail').value.trim();
        const role = document.getElementById('inviteRole').value;
        if (!email || !SupabaseService.currentWorkspace) return;

        try {
            await SupabaseService.inviteMember(SupabaseService.currentWorkspace.id, email, role);
            showToast(`Đã gửi lời mời đến ${email} (${role})!`);
            document.getElementById('inviteEmail').value = '';
            await renderMembersList();
        } catch (err) {
            showToast('⚠️ Lỗi mời thành viên: ' + err.message);
        }
    });

    window.handleRemoveMember = async (memberId) => {
        const res = await showCustomConfirm({
            title: 'Xóa Thành Viên?',
            message: 'Bạn có chắc chắn muốn xóa thành viên này khỏi sổ?',
            okText: 'Xóa Thành Viên',
            okColor: 'var(--expense)'
        });
        if (!res.confirmed) return;

        try {
            await SupabaseService.removeMember(memberId);
            showToast('Đã xóa thành viên!');
            await renderMembersList();
        } catch (e) {
            showToast('⚠️ Lỗi: ' + e.message);
        }
    };

    // ==================== NHẬT KÝ HOẠT ĐỘNG (AUDIT LOGS) ====================
    btnOpenLogsModal?.addEventListener('click', async () => {
        settingsMenuPopup?.classList.remove('active');
        if (!State.onlineMode) {
            showToast('Vui lòng đăng nhập để xem nhật ký hoạt động đồng bộ!');
            authModal?.classList.add('active');
            return;
        }
        await renderAuditLogs();
        document.getElementById('logsModal').classList.add('active');
    });

    document.getElementById('closeLogsModalBtn')?.addEventListener('click', () => {
        document.getElementById('logsModal').classList.remove('active');
    });

    async function renderAuditLogs() {
        const logsListTbody = document.getElementById('logsTableBody') || document.getElementById('logsListTbody');
        if (!logsListTbody) return;
        logsListTbody.innerHTML = '<tr><td colspan="5" style="text-align:center; padding:16px;">Đang tải nhật ký...</td></tr>';
        try {
            const logs = await SupabaseService.fetchAuditLogs();
            if (!logs || logs.length === 0) {
                logsListTbody.innerHTML = '<tr><td colspan="5" style="text-align:center; padding:16px;">Chưa có lịch sử hoạt động nào được ghi nhận.</td></tr>';
                return;
            }
            logsListTbody.innerHTML = logs.map(l => {
                const actionBadge = l.action === 'create' ? '<span class="log-badge log-create">Thêm Mới</span>' : (l.action === 'update' ? '<span class="log-badge log-update">Sửa</span>' : '<span class="log-badge log-delete">Xóa</span>');
                return `
                    <tr>
                        <td style="font-size:12px; color:var(--text-muted);">${l.created_at ? new Date(l.created_at).toLocaleString('vi-VN') : '---'}</td>
                        <td>${actionBadge}</td>
                        <td style="font-weight:700;">${l.profiles?.full_name || l.user_email || 'Thành viên'}</td>
                        <td style="font-size:12px;">${l.details || 'Thao tác dữ liệu'}</td>
                        <td style="font-size:12px; color:var(--text-muted);">${l.reason || '---'}</td>
                    </tr>
                `;
            }).join('');
        } catch (e) {
            logsListTbody.innerHTML = `<tr><td colspan="5" style="text-align:center; color:red; padding:16px;">Lỗi tải nhật ký: ${e.message}</td></tr>`;
        }
    }

    // ==================== TÍNH NĂNG AI: TỰ ĐỘNG NHẬN DIỆN DANH MỤC ====================
    const aiSuggestBadge = document.getElementById('aiSuggestBadge');
    const aiSuggestText = document.getElementById('aiSuggestText');

    function checkAndAutoPredictCategory(text) {
        if (!text || text.trim().length < 2) {
            if (aiSuggestBadge) aiSuggestBadge.style.display = 'none';
            return;
        }
        const pred = Utils.predictCategory(text);
        if (pred) {
            // Tự động chuyển loại Thu hoặc Chi phù hợp
            setModalType(pred.type, pred.categoryId);
            if (aiSuggestText) aiSuggestText.textContent = `AI tự nhận: ${pred.emoji} ${pred.categoryName}`;
            if (aiSuggestBadge) aiSuggestBadge.style.display = 'inline-flex';
        } else {
            if (aiSuggestBadge) aiSuggestBadge.style.display = 'none';
        }
    }

    txNote?.addEventListener('input', (e) => {
        checkAndAutoPredictCategory(e.target.value);
    });

    txNote?.addEventListener('blur', (e) => {
        checkAndAutoPredictCategory(e.target.value);
    });

    // ==================== DASHBOARD BÁO CÁO & BIỂU ĐỒ CỘT (CHART.JS) ====================
    let expenseChartInstance = null;

    btnOpenReports?.addEventListener('click', () => {
        const periodTxs = getFilteredTransactionsByPeriod();
        const totalInc = periodTxs.filter(t => t.type === 'income').reduce((sum, t) => sum + (Number(t.amount) || 0), 0);
        const totalExp = periodTxs.filter(t => t.type === 'expense').reduce((sum, t) => sum + (Number(t.amount) || 0), 0);

        // Group expenses by category
        const expCategoryMap = {};
        AppData.CATEGORIES.filter(c => c.type === 'expense' || c.type === 'both').forEach(c => {
            expCategoryMap[c.id] = { id: c.id, name: c.name, emoji: c.emoji, color: c.color, amount: 0 };
        });

        periodTxs.filter(t => t.type === 'expense').forEach(t => {
            if (t.sub_items && Array.isArray(t.sub_items) && t.sub_items.length > 0) {
                // Phân rã từng món con vào đúng danh mục con tương ứng
                t.sub_items.forEach(sub => {
                    const subAmount = Number(sub.amount) || 0;
                    if (subAmount > 0) {
                        const subCatId = sub.categoryId || t.categoryId || 'cat_other';
                        if (!expCategoryMap[subCatId]) {
                            const subCatObj = AppData.getCategoryById(subCatId, sub.name, 'expense');
                            expCategoryMap[subCatId] = { id: subCatId, name: subCatObj.name, emoji: subCatObj.emoji, color: subCatObj.color || '#64748b', amount: 0 };
                        }
                        expCategoryMap[subCatId].amount += subAmount;
                    }
                });
            } else {
                const catId = t.categoryId || 'cat_other';
                if (!expCategoryMap[catId]) {
                    const catObj = AppData.getCategoryById(catId, t.note, 'expense');
                    expCategoryMap[catId] = { id: catId, name: catObj.name, emoji: catObj.emoji, color: catObj.color || '#64748b', amount: 0 };
                }
                expCategoryMap[catId].amount += Number(t.amount) || 0;
            }
        });

        const expenseCategories = Object.values(expCategoryMap)
            .filter(c => c.amount > 0)
            .sort((a, b) => b.amount - a.amount);

        // 1. KPI Cards
        document.getElementById('reportKpiIncome').textContent = `+${Utils.formatCurrency(totalInc)}`;
        document.getElementById('reportKpiExpense').textContent = `-${Utils.formatCurrency(totalExp)}`;

        const highestCat = expenseCategories[0] || null;
        if (highestCat && totalExp > 0) {
            const highestPercent = Math.round((highestCat.amount / totalExp) * 100);
            document.getElementById('reportKpiHighest').textContent = `${highestCat.emoji} ${highestCat.name} (${highestPercent}%)`;
            
            // 2. AI Financial Insights Evaluation
            let insightHtml = `Trong kỳ này, bạn đang chi tiêu cao nhất cho danh mục <b>${highestCat.emoji} ${highestCat.name}</b> với tổng số tiền <b>${Utils.formatCurrency(highestCat.amount)}</b> (chiếm <b>${highestPercent}%</b> tổng chi tiêu). `;
            if (highestPercent >= 40) {
                insightHtml += `<span style="color: #ef4444; font-weight: 700;">⚠️ Tỷ trọng này đang ở mức CAO.</span> Bạn nên cân đối và cắt giảm bớt các khoản chi không cần thiết ở danh mục này để gia tăng tích lũy tài chính.`;
            } else if (highestPercent >= 25) {
                insightHtml += `<span style="color: #f59e0b; font-weight: 700;">🟡 Tỷ trọng ở mức VỪA PHẢI.</span> Hãy duy trì hạn mức chi tiêu hợp lý trong các tuần tiếp theo.`;
            } else {
                insightHtml += `<span style="color: #10b981; font-weight: 700;">🟢 Dòng tiền phân bổ RẤT ĐỀU ĐẶN & HỢP LÝ.</span> Bạn đang quản lý ngân sách rất tốt!`;
            }
            document.getElementById('aiInsightsMessage').innerHTML = insightHtml;
        } else {
            document.getElementById('reportKpiHighest').textContent = 'Chưa có chi tiêu';
            document.getElementById('aiInsightsMessage').textContent = 'Chưa có đủ dữ liệu chi tiêu trong kỳ này để AI thực hiện đánh giá.';
        }

        // 3. Render / Update Chart.js Bar Chart
        const chartCanvas = document.getElementById('expenseBarChartCanvas');
        if (chartCanvas && window.Chart) {
            if (expenseChartInstance) {
                expenseChartInstance.destroy();
            }

            const chartLabels = expenseCategories.map(c => `${c.emoji} ${c.name}`);
            const chartData = expenseCategories.map(c => c.amount);
            const chartColors = expenseCategories.map(c => c.color || '#3b82f6');

            const textColor = '#64748b';
            const gridColor = '#f1f5f9';

            expenseChartInstance = new Chart(chartCanvas, {
                type: 'bar',
                data: {
                    labels: chartLabels.length > 0 ? chartLabels : ['Chưa có dữ liệu'],
                    datasets: [{
                        label: 'Số tiền chi tiêu (VNĐ)',
                        data: chartData.length > 0 ? chartData : [0],
                        backgroundColor: chartColors.length > 0 ? chartColors : ['#e2e8f0'],
                        borderRadius: 6,
                        borderSkipped: false,
                        maxBarThickness: 36
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: { display: false },
                        tooltip: {
                            callbacks: {
                                label: (context) => {
                                    const val = context.raw || 0;
                                    const percent = totalExp > 0 ? Math.round((val / totalExp) * 100) : 0;
                                    return ` Chi tiêu: ${Utils.formatCurrency(val)} (${percent}%)`;
                                }
                            }
                        }
                    },
                    scales: {
                        x: {
                            grid: { display: false },
                            ticks: { color: textColor, font: { weight: '600', size: 11 } }
                        },
                        y: {
                            grid: { color: gridColor },
                            ticks: {
                                color: textColor,
                                font: { size: 10.5 },
                                callback: (val) => {
                                    if (val >= 1e6) return (val / 1e6) + 'Tr';
                                    if (val >= 1e3) return (val / 1e3) + 'K';
                                    return val;
                                }
                            }
                        }
                    }
                }
            });
        }

        // 4. Render Category Rows Breakdown (2-line clean layout)
        const categoryListRows = document.getElementById('categoryListRows');
        if (expenseCategories.length === 0) {
            categoryListRows.innerHTML = `<div style="text-align: center; color: var(--text-muted); padding: 16px; font-size: 12px;">Chưa có khoản chi nào trong kỳ này.</div>`;
        } else {
            categoryListRows.innerHTML = expenseCategories.map(c => {
                const percent = totalExp > 0 ? Math.round((c.amount / totalExp) * 100) : 0;

                return `
                    <div class="category-row-item-v2">
                        <div class="cat-row-top">
                            <div class="cat-row-title">
                                <span class="cat-emoji-circle">${c.emoji || '🏷️'}</span>
                                <span class="cat-name-tag" title="${c.name}">${c.name}</span>
                            </div>
                            <span class="cat-amount-tag text-expense">-${Utils.formatCurrency(c.amount)}</span>
                        </div>
                        <div class="cat-row-bottom">
                            <div class="cat-bar-container-v2">
                                <div class="cat-bar-fill-v2" style="width: ${percent}%; background: ${c.color || 'var(--expense)'};"></div>
                            </div>
                            <span class="cat-percent-tag">${percent}%</span>
                        </div>
                    </div>
                `;
            }).join('');
        }

        document.getElementById('reportsModal').classList.add('active');
    });

    document.getElementById('closeReportsModalBtn')?.addEventListener('click', () => {
        document.getElementById('reportsModal').classList.remove('active');
    });

    // ==================== FILTER EVENTS ====================
    periodFilter?.addEventListener('change', (e) => {
        State.period = e.target.value;
        if (State.period === 'custom') {
            customDateInputs.style.display = 'flex';
        } else {
            customDateInputs.style.display = 'none';
        }
        State.currentPage = 1;
        State.mobileVisibleCount = 10;
        render();
    });

    filterStartDate?.addEventListener('change', (e) => {
        State.startDate = e.target.value;
        State.currentPage = 1;
        State.mobileVisibleCount = 10;
        render();
    });

    filterEndDate?.addEventListener('change', (e) => {
        State.endDate = e.target.value;
        State.currentPage = 1;
        State.mobileVisibleCount = 10;
        render();
    });

    typeFilter?.addEventListener('change', (e) => {
        State.type = e.target.value;
        State.currentPage = 1;
        State.mobileVisibleCount = 10;
        render();
    });

    searchInput?.addEventListener('input', (e) => {
        State.keyword = e.target.value;
        State.currentPage = 1;
        State.mobileVisibleCount = 10;
        render();
    });

    // Export Excel
    btnExportCsv?.addEventListener('click', async () => {
        const currentFiltered = getTableFilteredList();
        const wsName = SupabaseService.currentWorkspace ? SupabaseService.currentWorkspace.name : 'Sổ Thu Chi';
        let periodLabel = 'Tháng này';
        if (State.period === 'last_month') periodLabel = 'Tháng trước';
        else if (State.period === 'all') periodLabel = 'Toàn thời gian';
        else if (State.period === 'custom') periodLabel = `Từ ${State.startDate} đến ${State.endDate}`;

        showToast('📊 Đang tạo và tải file Excel (.xlsx) bản đẹp...');
        await Utils.exportBeautifulColoredExcel(currentFiltered, wsName, periodLabel);
    });

    // Custom Confirm Dialog
    function showCustomConfirm(options) {
        return new Promise((resolve) => {
            const confirmModal = document.getElementById('confirmModal');
            const confirmTitle = document.getElementById('confirmTitle');
            const confirmMessage = document.getElementById('confirmMessage');
            const confirmIcon = document.getElementById('confirmIcon');
            const confirmIconWrap = document.getElementById('confirmIconWrap');
            const confirmReasonBox = document.getElementById('confirmReasonBox');
            const confirmReasonInput = document.getElementById('confirmReasonInput');
            const btnConfirmOk = document.getElementById('btnConfirmOk');
            const btnConfirmCancel = document.getElementById('btnConfirmCancel');

            confirmTitle.textContent = options.title || 'Xác Nhận';
            confirmMessage.textContent = options.message || 'Bạn có chắc chắn muốn thực hiện thao tác này?';
            btnConfirmOk.textContent = options.okText || 'Xác nhận';
            btnConfirmOk.style.background = options.okColor || 'var(--expense)';

            if (confirmIcon) {
                confirmIcon.className = options.icon || 'fa-solid fa-triangle-exclamation';
            }
            if (confirmIconWrap) {
                confirmIconWrap.style.background = options.iconBg || '#fee2e2';
                confirmIconWrap.style.color = options.iconColor || '#ef4444';
            }

            if (options.requireReason) {
                confirmReasonBox.style.display = 'block';
                confirmReasonInput.value = '';
                setTimeout(() => confirmReasonInput.focus(), 150);
            } else {
                confirmReasonBox.style.display = 'none';
            }

            confirmModal.classList.add('active');

            const onOk = () => {
                if (options.requireReason) {
                    const reason = confirmReasonInput.value.trim();
                    if (!reason) {
                        showToast('⚠️ Vui lòng nhập lý do xóa!');
                        confirmReasonInput.focus();
                        return;
                    }
                    cleanup();
                    resolve({ confirmed: true, reason: reason });
                } else {
                    cleanup();
                    resolve({ confirmed: true, reason: '' });
                }
            };

            const onCancel = () => {
                cleanup();
                resolve({ confirmed: false, reason: '' });
            };

            const cleanup = () => {
                confirmModal.classList.remove('active');
                btnConfirmOk.removeEventListener('click', onOk);
                btnConfirmCancel.removeEventListener('click', onCancel);
            };

            btnConfirmOk.addEventListener('click', onOk);
            btnConfirmCancel.addEventListener('click', onCancel);
        });
    }

    // Custom Prompt Dialog (No native prompt popup)
    function showCustomPrompt(options) {
        return new Promise((resolve) => {
            const promptModal = document.getElementById('promptModal');
            const promptTitle = document.getElementById('promptTitle');
            const promptMessage = document.getElementById('promptMessage');
            const promptInput = document.getElementById('promptInput');
            const btnPromptOk = document.getElementById('btnPromptOk');
            const btnPromptCancel = document.getElementById('btnPromptCancel');

            if (promptTitle) promptTitle.textContent = options.title || 'Nhập Thông Tin';
            if (promptMessage) promptMessage.textContent = options.message || 'Vui lòng nhập nội dung:';
            if (promptInput) {
                promptInput.value = options.defaultValue || '';
                promptInput.placeholder = options.placeholder || '';
            }
            if (btnPromptOk) btnPromptOk.textContent = options.okText || 'Lưu lại';

            promptModal.classList.add('active');
            setTimeout(() => promptInput?.focus(), 150);

            const onOk = () => {
                const val = promptInput.value.trim();
                cleanup();
                resolve(val);
            };

            const onCancel = () => {
                cleanup();
                resolve(null);
            };

            const onKeyDown = (e) => {
                if (e.key === 'Enter') onOk();
                if (e.key === 'Escape') onCancel();
            };

            const cleanup = () => {
                promptModal.classList.remove('active');
                btnPromptOk.removeEventListener('click', onOk);
                btnPromptCancel.removeEventListener('click', onCancel);
                promptInput.removeEventListener('keydown', onKeyDown);
            };

            btnPromptOk.addEventListener('click', onOk);
            btnPromptCancel.addEventListener('click', onCancel);
            promptInput.addEventListener('keydown', onKeyDown);
        });
    }

    // ==================== QUẢN LÝ & TÙY CHỈNH DANH MỤC ====================
    let currentCatManagerType = 'expense';

    function openCatManagerModal(type = 'expense') {
        currentCatManagerType = type;
        const modal = document.getElementById('catManagerModal');
        if (!modal) return;

        // Sync tab buttons
        document.getElementById('tabCatManagerIncome')?.classList.toggle('active', type === 'income');
        document.getElementById('tabCatManagerExpense')?.classList.toggle('active', type === 'expense');

        // Reset inputs
        const nameInput = document.getElementById('newCatNameInput');
        if (nameInput) nameInput.value = '';
        const selectedEmoji = document.getElementById('selectedCatEmoji');
        const btnEmoji = document.getElementById('btnSelectedEmoji');
        if (selectedEmoji && btnEmoji) {
            const defaultEmoji = type === 'income' ? '💰' : '☕';
            selectedEmoji.value = defaultEmoji;
            btnEmoji.textContent = defaultEmoji;
        }

        renderCatItemsList(type);
        modal.classList.add('active');
        setTimeout(() => nameInput?.focus(), 150);
    }

    function closeCatManagerModal() {
        const modal = document.getElementById('catManagerModal');
        if (modal) modal.classList.remove('active');
        populateCategoriesForType(txType.value, txCategory.value !== '__add_new__' ? txCategory.value : null);
        render(); // Refresh table tags and charts if categories changed
    }

    function renderCatItemsList(type) {
        const container = document.getElementById('catItemsList');
        if (!container) return;
        const list = AppData.getCategoriesByType(type);

        container.innerHTML = list.map(c => {
            const isCustom = c.isCustom || !c.isDefault;
            return `
                <div class="cat-item-row" data-id="${c.id}">
                    <div class="cat-item-left">
                        <span class="cat-emoji-circle">${c.emoji}</span>
                        <span class="cat-name-tag">${c.name}</span>
                        ${!isCustom ? '<span class="cat-item-badge-default">Mặc định</span>' : ''}
                    </div>
                    <div class="cat-item-actions">
                        <button type="button" class="btn-cat-mini btn-cat-edit" data-id="${c.id}" title="Đổi tên danh mục">
                            <i class="fa-solid fa-pen"></i>
                        </button>
                        ${isCustom ? `
                        <button type="button" class="btn-cat-mini btn-cat-del" data-id="${c.id}" title="Xóa danh mục">
                            <i class="fa-solid fa-trash-can"></i>
                        </button>
                        ` : ''}
                    </div>
                </div>
            `;
        }).join('');

        // Attach edit handlers
        container.querySelectorAll('.btn-cat-edit').forEach(btn => {
            btn.addEventListener('click', async () => {
                const cat = AppData.CATEGORIES.find(x => x.id === btn.dataset.id);
                if (!cat) return;
                const newName = await showCustomPrompt({
                    title: 'Đổi Tên Danh Mục',
                    message: `Nhập tên mới cho danh mục "${cat.emoji} ${cat.name}":`,
                    defaultValue: cat.name,
                    okText: 'Lưu thay đổi'
                });
                if (newName && newName.trim() && newName.trim() !== cat.name) {
                    if (cat.isCustom) {
                        AppData.updateCategory(cat.id, { name: newName.trim() });
                    } else {
                        AppData.addCategory({ name: newName.trim(), emoji: cat.emoji, type: cat.type });
                    }
                    showToast('Đã cập nhật danh mục!');
                    renderCatItemsList(type);
                    populateCategoriesForType(txType.value, cat.id);
                }
            });
        });

        // Attach delete handlers
        container.querySelectorAll('.btn-cat-del').forEach(btn => {
            btn.addEventListener('click', async () => {
                const cat = AppData.CATEGORIES.find(x => x.id === btn.dataset.id);
                if (!cat) return;
                const res = await showCustomConfirm({
                    title: 'Xóa Danh Mục?',
                    message: `Bạn có chắc chắn muốn xóa danh mục "${cat.emoji} ${cat.name}"?`,
                    okText: 'Xóa Danh Mục',
                    okColor: 'var(--expense)'
                });
                if (res.confirmed) {
                    AppData.deleteCategory(cat.id);
                    showToast('Đã xóa danh mục!');
                    renderCatItemsList(type);
                    populateCategoriesForType(txType.value);
                }
            });
        });
    }

    // Event listeners for Cat Manager
    document.getElementById('btnOpenCatManager')?.addEventListener('click', () => {
        openCatManagerModal(txType.value);
    });

    document.getElementById('closeCatManagerBtn')?.addEventListener('click', closeCatManagerModal);
    document.getElementById('btnDoneCatManager')?.addEventListener('click', closeCatManagerModal);

    document.getElementById('tabCatManagerIncome')?.addEventListener('click', () => {
        currentCatManagerType = 'income';
        document.getElementById('tabCatManagerIncome').classList.add('active');
        document.getElementById('tabCatManagerExpense').classList.remove('active');
        document.getElementById('selectedCatEmoji').value = '💰';
        document.getElementById('btnSelectedEmoji').textContent = '💰';
        renderCatItemsList('income');
    });

    document.getElementById('tabCatManagerExpense')?.addEventListener('click', () => {
        currentCatManagerType = 'expense';
        document.getElementById('tabCatManagerExpense').classList.add('active');
        document.getElementById('tabCatManagerIncome').classList.remove('active');
        document.getElementById('selectedCatEmoji').value = '☕';
        document.getElementById('btnSelectedEmoji').textContent = '☕';
        renderCatItemsList('expense');
    });

    // Emoji Picker Popover
    const btnSelectedEmoji = document.getElementById('btnSelectedEmoji');
    const emojiQuickPopover = document.getElementById('emojiQuickPopover');
    const selectedCatEmoji = document.getElementById('selectedCatEmoji');

    btnSelectedEmoji?.addEventListener('click', (e) => {
        e.stopPropagation();
        const isShown = emojiQuickPopover.style.display === 'block';
        emojiQuickPopover.style.display = isShown ? 'none' : 'block';
    });

    document.querySelectorAll('#emojiPickerGrid span').forEach(span => {
        span.addEventListener('click', () => {
            const emoji = span.textContent.trim();
            if (selectedCatEmoji && btnSelectedEmoji) {
                selectedCatEmoji.value = emoji;
                btnSelectedEmoji.textContent = emoji;
            }
            if (emojiQuickPopover) emojiQuickPopover.style.display = 'none';
        });
    });

    document.addEventListener('click', (e) => {
        if (emojiQuickPopover && !e.target.closest('.emoji-picker-dropdown-wrap')) {
            emojiQuickPopover.style.display = 'none';
        }
    });

    // Submit new category form
    document.getElementById('newCatForm')?.addEventListener('submit', (e) => {
        e.preventDefault();
        const input = document.getElementById('newCatNameInput');
        const name = (input ? input.value : '').trim();
        if (!name) return;

        const emoji = selectedCatEmoji ? selectedCatEmoji.value : '🏷️';
        const newCat = AppData.addCategory({
            name: name,
            emoji: emoji,
            type: currentCatManagerType
        });

        input.value = '';
        showToast(`Đã thêm danh mục: ${newCat.emoji} ${newCat.name}!`);
        renderCatItemsList(currentCatManagerType);
        populateCategoriesForType(txType.value, newCat.id);
    });

    // ==================== 1. SAO LƯU & PHỤC HỒI DỮ LIỆU 1 CHẠM (JSON) ====================
    document.getElementById('btnBackupJson')?.addEventListener('click', () => {
        document.getElementById('settingsMenuPopup')?.classList.remove('active');
        const backupObj = {
            app: 'SoThuChiVN',
            version: '1.1.0',
            exportedAt: new Date().toISOString(),
            workspace: (State.onlineMode && SupabaseService.currentWorkspace) ? {
                id: SupabaseService.currentWorkspace.id,
                name: SupabaseService.currentWorkspace.name
            } : { id: 'default', name: 'Home' },
            transactions: State.transactions,
            categories: (AppData.CATEGORIES || [])
        };

        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(backupObj, null, 2));
        const now = new Date();
        const pad = n => n.toString().padStart(2, '0');
        const dateStr = `${now.getFullYear()}${pad(now.getMonth() + 1)}${pad(now.getDate())}_${pad(now.getHours())}${pad(now.getMinutes())}`;
        const filename = `SoThuChi_Backup_${dateStr}.json`;

        const a = document.createElement('a');
        a.setAttribute("href", dataStr);
        a.setAttribute("download", filename);
        document.body.appendChild(a);
        a.click();
        a.remove();

        showToast(`📥 Đã tải về file sao lưu: ${filename}`);
    });

    const restoreInput = document.getElementById('restoreJsonFileInput');
    document.getElementById('btnRestoreJson')?.addEventListener('click', () => {
        document.getElementById('settingsMenuPopup')?.classList.remove('active');
        if (restoreInput) {
            restoreInput.value = '';
            restoreInput.click();
        }
    });

    restoreInput?.addEventListener('change', async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        try {
            const text = await file.text();
            const data = JSON.parse(text);

            if (!data || !Array.isArray(data.transactions)) {
                showToast('⚠️ File JSON không hợp lệ hoặc thiếu dữ liệu giao dịch!');
                return;
            }

            const count = data.transactions.length;
            const confirmRes = await showCustomConfirm({
                title: 'Phục Hồi Dữ Liệu?',
                message: `Tìm thấy ${count} giao dịch trong file "${file.name}". Bạn có muốn phục hồi và hợp nhất vào sổ hiện tại không?`,
                okText: 'Phục hồi',
                okColor: '#2563eb'
            });

            if (confirmRes && confirmRes.confirmed) {
                const existingIds = new Set(State.transactions.map(t => t.id));
                let addedCount = 0;

                for (const tx of data.transactions) {
                    if (!existingIds.has(tx.id)) {
                        State.transactions.unshift(tx);
                        existingIds.add(tx.id);
                        addedCount++;
                    }
                }

                AppData.saveTransactions(State.transactions);

                if (State.onlineMode && SupabaseService.currentWorkspace) {
                    for (const tx of data.transactions) {
                        await SupabaseService.addTransaction({
                            type: tx.type,
                            amount: tx.amount,
                            note: tx.note,
                            date: tx.date,
                            category_id: tx.categoryId || tx.category_id
                        });
                    }
                }

                render();
                showToast(`🎉 Phục hồi thành công! Đã nạp ${addedCount} giao dịch.`);
            }
        } catch (err) {
            console.error('Error parsing JSON backup:', err);
            showToast('⚠️ Lỗi đọc file JSON: ' + err.message);
        }
    });

    // ==================== 4. NHẮC NHỞ GHI CHÚ BUỔI TRƯA (12H) & BUỔI TỐI (21H) ====================
    const reminderToggle = document.getElementById('toggleDailyReminder');
    if (reminderToggle) {
        reminderToggle.checked = localStorage.getItem('sothuchi_reminder_active') === 'true';

        reminderToggle.addEventListener('change', async () => {
            if (reminderToggle.checked) {
                if (!("Notification" in window)) {
                    showToast('⚠️ Trình duyệt không hỗ trợ Web Notification!');
                    reminderToggle.checked = false;
                    return;
                }

                if (Notification.permission === 'default') {
                    const perm = await Notification.requestPermission();
                    if (perm !== 'granted') {
                        showToast('⚠️ Bạn đã từ chối cấp quyền thông báo!');
                        reminderToggle.checked = false;
                        localStorage.setItem('sothuchi_reminder_active', 'false');
                        return;
                    }
                } else if (Notification.permission === 'denied') {
                    showToast('⚠️ Vui lòng bật quyền thông báo trong cài đặt trình duyệt!');
                    reminderToggle.checked = false;
                    localStorage.setItem('sothuchi_reminder_active', 'false');
                    return;
                }

                localStorage.setItem('sothuchi_reminder_active', 'true');
                showToast('🔔 Đã bật nhắc nhở "Đến giờ ghi chú" lúc 12:00 trưa & 21:00 tối!');
            } else {
                localStorage.setItem('sothuchi_reminder_active', 'false');
                showToast('🔕 Đã tắt nhắc nhở hàng ngày.');
            }
        });
    }

    function triggerReminderNotification(title, body) {
        // 1. Web Browser Notification
        if ("Notification" in window && Notification.permission === 'granted') {
            try {
                const notif = new Notification(title, {
                    body: body,
                    icon: 'icons/icon-192.png',
                    badge: 'icons/icon-192.png'
                });
                notif.onclick = () => {
                    window.focus();
                    document.getElementById('openExpenseModalBtn')?.click();
                };
            } catch (err) {
                console.warn('Web notification error:', err);
            }
        }

        // 2. In-App Toast Alert
        showToast(`${title}\n${body}`);
    }

    function checkDailyReminders() {
        if (localStorage.getItem('sothuchi_reminder_active') !== 'true') return;

        const now = new Date();
        const hours = now.getHours();
        const minutes = now.getMinutes();
        const todayKey = now.toISOString().slice(0, 10);

        // 1. Mốc 12h trưa (12:00 -> 12:15)
        if (hours === 12 && minutes < 15) {
            if (localStorage.getItem('sothuchi_last_reminder_12') !== todayKey) {
                localStorage.setItem('sothuchi_last_reminder_12', todayKey);
                triggerReminderNotification(
                    '⏰ Sổ Thu Chi - Đến giờ ghi chú! (12:00 Trưa)',
                    'Nghỉ trưa rồi! Bạn có khoản ăn trưa, cà phê nào cần ghi chép lại không?'
                );
            }
        }

        // 2. Mốc 21h tối (21:00 -> 21:15)
        if (hours === 21 && minutes < 15) {
            if (localStorage.getItem('sothuchi_last_reminder_21') !== todayKey) {
                localStorage.setItem('sothuchi_last_reminder_21', todayKey);
                triggerReminderNotification(
                    '🌙 Sổ Thu Chi - Đến giờ ghi chú! (21:00 Tối)',
                    'Đã 21h tối rồi! Hãy dành 30 giây tổng kết lại các khoản thu chi hôm nay nhé!'
                );
            }
        }
    }

    setInterval(checkDailyReminders, 30000);
    setTimeout(checkDailyReminders, 2000);

    // ==================== OFFLINE MANAGER (TỰ ĐỘNG TẢI NỀN VỀ MÁY) ====================
    window.OfflineManager = {
        cacheName: 'sothuchi-offline-v1.7.5',
        assets: [
            '/',
            '/index.html',
            '/manifest.json',
            '/favicon.ico',
            '/css/styles.css',
            '/css/styles.css?v=1.7.5',
            '/js/utils.js',
            '/js/utils.js?v=1.7.5',
            '/js/data.js',
            '/js/data.js?v=1.7.5',
            '/js/supabase-config.js',
            '/js/supabase-config.js?v=1.7.5',
            '/js/app.js',
            '/js/app.js?v=1.7.5',
            '/libs/fontawesome.min.css',
            '/libs/chart.min.js',
            '/libs/exceljs.min.js',
            '/libs/supabase.min.js',
            '/webfonts/fa-solid-900.woff2',
            '/webfonts/fa-regular-400.woff2',
            '/webfonts/fa-brands-400.woff2',
            '/icons/icon-192.png',
            '/icons/icon-512.png',
            '/icons/apple-touch-icon.png',
            '/icons/favicon.png'
        ],
        async preloadAll(showFeedback = false) {
            if (!('caches' in window)) return;
            try {
                const cache = await caches.open(this.cacheName);
                
                // 1. Lưu trực tiếp HTML hiện tại vào cache để mở offline tức thì 0ms
                if (document.documentElement && document.documentElement.outerHTML) {
                    const htmlDoc = '<!DOCTYPE html>\n' + document.documentElement.outerHTML;
                    await cache.put('/index.html', new Response(htmlDoc, { headers: { 'Content-Type': 'text/html; charset=utf-8' } }));
                    await cache.put('/', new Response(htmlDoc, { headers: { 'Content-Type': 'text/html; charset=utf-8' } }));
                }

                // 2. Nạp toàn bộ tài nguyên tĩnh
                let count = 2; // Đã lưu / và /index.html
                for (const url of this.assets) {
                    if (url === '/' || url === '/index.html') continue;
                    try {
                        const res = await fetch(url);
                        if (res && res.status === 200) {
                            await cache.put(url, res);
                            count++;
                        }
                    } catch (e) {}
                }
                localStorage.setItem('sothuchi_offline_ready_v175', 'true');
                localStorage.setItem('sothuchi_offline_cached_count', String(count));
                this.updateBadge(count);
                if (showFeedback) {
                    showToast(`✅ Đã tải sẵn toàn bộ ứng dụng (${count}/${this.assets.length} tệp) vào điện thoại! Sẵn sàng mở không cần mạng.`);
                }
                console.log(`[OfflineManager] Đã nạp thành công ${count}/${this.assets.length} tệp!`);
            } catch (err) {
                console.warn('[OfflineManager] Preload error:', err);
                if (showFeedback) showToast('⚠️ Có lỗi khi tải trước: ' + err.message);
            }
        },
        updateBadge(count) {
            const badge = document.getElementById('badgeOfflineStatus');
            if (badge) {
                const total = this.assets.length;
                const c = count || localStorage.getItem('sothuchi_offline_cached_count') || total;
                badge.textContent = `Sẵn sàng (${c}/${total})`;
                badge.style.background = '#ecfdf5';
                badge.style.color = '#059669';
            }
        }
    };

    window.handlePreloadOfflineAssets = () => {
        showToast('⏳ Đang tải toàn bộ ứng dụng về bộ nhớ điện thoại...');
        window.OfflineManager.preloadAll(true);
    };

    // Tự động nạp trực tiếp trang HTML và tài nguyên vào cache sau khi mở 1s
    setTimeout(() => {
        if (window.OfflineManager) {
            window.OfflineManager.preloadAll(false);
        }
    }, 1000);

    // ==================== PWA INSTALL PROMPT HANDLER ====================
    let deferredPwaPrompt = null;

    window.addEventListener('beforeinstallprompt', (e) => {
        e.preventDefault();
        deferredPwaPrompt = e;
        console.log('✅ [PWA] Sẵn sàng kích hoạt cài đặt màn hình chính!');
    });

    window.addEventListener('appinstalled', () => {
        deferredPwaPrompt = null;
        showToast('🎉 Đã cài đặt Sổ Thu Chi vào màn hình chính thành công!');
    });

    window.handleInstallPwaApp = async () => {
        if (deferredPwaPrompt) {
            deferredPwaPrompt.prompt();
            const choice = await deferredPwaPrompt.userChoice;
            if (choice && choice.outcome === 'accepted') {
                showToast('🎉 Đang thêm ứng dụng vào màn hình chính...');
            }
            deferredPwaPrompt = null;
        } else {
            // Hướng dẫn chi tiết cho từng loại trình duyệt Samsung/iOS/Chrome
            const ua = navigator.userAgent || '';
            const isSamsung = /samsung/i.test(ua);
            const isIOS = /iphone|ipad|ipod/i.test(ua);
            
            let guideMsg = '';
            if (isSamsung) {
                guideMsg = 'Để đưa biểu tượng Sổ Thu Chi ra màn hình chính Samsung:\n\n1. Bấm nút Menu ☰ (3 dấu gạch ở góc dưới màn hình).\n2. Chọn "Thêm trang vào" (Add page to).\n3. Chọn "Màn hình chờ" (Màn hình chính).\n\n(Hoặc bấm biểu tượng mũi tên tải xuống ở thanh địa chỉ web).';
            } else if (isIOS) {
                guideMsg = 'Để đưa biểu tượng ra màn hình iPhone:\n\n1. Bấm nút Chia sẻ [ ↑ ] ở thanh dưới trình duyệt Safari.\n2. Cuộn xuống và chọn "Thêm vào MH chính" (Add to Home Screen).';
            } else {
                guideMsg = 'Để đưa biểu tượng ra màn hình chính:\n\n1. Bấm dấu 3 chấm (⋮) ở góc trên bên phải trình duyệt.\n2. Chọn "Cài đặt ứng dụng" hoặc "Thêm vào màn hình chính".';
            }

            await showCustomConfirm({
                title: 'Cài Đặt Về Màn Hình Chính',
                message: guideMsg,
                okText: 'Đã hiểu',
                cancelText: 'Đóng',
                okColor: '#2563eb'
            });
        }
    };

    // ==================== 📋 BATCH NOTES IMPORT & DEMO ACCOUNT MODE ====================
    const btnOpenBatchNotes = document.getElementById('btnOpenBatchNotes');
    const btnBatchImportPill = document.getElementById('btnBatchImportPill');
    const btnBannerOpenBatch = document.getElementById('btnBannerOpenBatch');
    const batchNotesModal = document.getElementById('batchNotesModal');
    const closeBatchNotesModalBtn = document.getElementById('closeBatchNotesModalBtn');
    const btnCancelBatchModal = document.getElementById('btnCancelBatchModal');
    const batchNotesInput = document.getElementById('batchNotesInput');
    const btnPasteSampleNotes = document.getElementById('btnPasteSampleNotes');
    const btnClearBatchNotes = document.getElementById('btnClearBatchNotes');
    const btnParseBatchNotes = document.getElementById('btnParseBatchNotes');
    const btnTestOnDemoAccount = document.getElementById('btnTestOnDemoAccount');
    const batchPreviewContainer = document.getElementById('batchPreviewContainer');
    const batchPreviewTbody = document.getElementById('batchPreviewTbody');
    const batchSumCount = document.getElementById('batchSumCount');
    const batchSumIncome = document.getElementById('batchSumIncome');
    const batchSumExpense = document.getElementById('batchSumExpense');
    const btnSaveBatchTransactions = document.getElementById('btnSaveBatchTransactions');
    const batchSaveCountBtn = document.getElementById('batchSaveCountBtn');

    const btnToggleDemoMode = document.getElementById('btnToggleDemoMode');
    const demoModeBanner = document.getElementById('demoModeBanner');
    const btnExitDemoMode = document.getElementById('btnExitDemoMode');
    const demoModeMenuText = document.getElementById('demoModeMenuText');
    const badgeDemoStatus = document.getElementById('badgeDemoStatus');

    // Mẫu văn bản của Sếp
    const BOSS_SAMPLE_NOTES = `mượn tiền đóng học phí 2160\n\nmượn chị 500k để mua khăn giấy ướt + khăn khô đa năng và dùng sinh hoạt\n\ntrả tiền cho bà nội điện + nước( cấn trừ còn 340k )\n\nmượn bà nội 1tr lo viện phí và chi tiêu trong nhà ( khám 305k-22k) + thuốc 236k`;

    let currentBatchParsedList = [];

    function openBatchNotesModal() {
        if (!batchNotesModal) return;
        batchNotesModal.classList.add('active');
        if (batchNotesInput) {
            batchNotesInput.focus();
        }
    }

    function closeBatchNotesModal() {
        if (!batchNotesModal) return;
        batchNotesModal.classList.remove('active');
    }

    btnOpenBatchNotes?.addEventListener('click', openBatchNotesModal);
    btnBatchImportPill?.addEventListener('click', openBatchNotesModal);
    btnBannerOpenBatch?.addEventListener('click', openBatchNotesModal);
    closeBatchNotesModalBtn?.addEventListener('click', closeBatchNotesModal);
    btnCancelBatchModal?.addEventListener('click', closeBatchNotesModal);

    // Dán mẫu của Sếp
    btnPasteSampleNotes?.addEventListener('click', () => {
        if (batchNotesInput) {
            batchNotesInput.value = BOSS_SAMPLE_NOTES;
            handleParseBatchText();
            showToast('✅ Đã nạp 4 dòng ghi chú mẫu của Sếp!');
        }
    });

    // Xóa trắng
    btnClearBatchNotes?.addEventListener('click', () => {
        if (batchNotesInput) batchNotesInput.value = '';
        currentBatchParsedList = [];
        if (batchPreviewContainer) batchPreviewContainer.style.display = 'none';
        if (btnSaveBatchTransactions) btnSaveBatchTransactions.style.display = 'none';
    });

    // Bấm bóc tách
    btnParseBatchNotes?.addEventListener('click', handleParseBatchText);

    function handleParseBatchText() {
        const text = batchNotesInput?.value?.trim() || '';
        if (!text) {
            showToast('Vui lòng dán hoặc nhập nội dung ghi chú!');
            return;
        }

        const parsed = Utils.parseBatchNotes(text);
        if (!parsed || parsed.length === 0) {
            showToast('Không tìm thấy dòng giao dịch hoặc số tiền hợp lệ.');
            return;
        }

        currentBatchParsedList = parsed;
        renderBatchPreviewTable();
    }

    function renderBatchPreviewTable() {
        if (!batchPreviewTbody || !batchPreviewContainer) return;
        batchPreviewTbody.innerHTML = '';

        let totalInc = 0;
        let totalExp = 0;

        currentBatchParsedList.forEach((it, index) => {
            const row = document.createElement('tr');
            row.style.borderBottom = '1px solid #f1f5f9';

            const amount = Number(it.amount) || 0;
            if (it.type === 'income') {
                totalInc += amount;
            } else {
                totalExp += amount;
            }

            // Sub items html
            let subItemsHtml = '';
            if (it.sub_items && it.sub_items.length > 0) {
                const subDetails = it.sub_items.map(s => `${s.name}: ${Utils.formatCurrency(s.amount)}`).join(' + ');
                subItemsHtml = `<div class="batch-subitem-badge" title="${subDetails}"><i class="fa-solid fa-list-check"></i> ${it.sub_items.length} món con: ${subDetails}</div>`;
            }

            // Debt tag html (Nhận diện đối tác công nợ)
            let debtTagHtml = '';
            if (it.debt_info && it.debt_info.isDebt) {
                const actText = it.debt_info.action === 'borrow' ? 'Đi vay (Tôi nợ)' : (it.debt_info.action === 'repay' ? 'Trả nợ / Cấn trừ' : (it.debt_info.action === 'lend' ? 'Cho vay' : 'Thu nợ'));
                debtTagHtml = `<div class="batch-debt-tag ${it.debt_info.action}" title="Tự động đồng bộ vào Sổ Công Nợ"><i class="fa-solid fa-handshake"></i> ${it.debt_info.contact}: ${actText}</div>`;
            }

            // Categories options
            const cats = it.type === 'income' ? AppData.INCOME_CATEGORIES : AppData.EXPENSE_CATEGORIES;
            let optionsHtml = '';
            cats.forEach(c => {
                const sel = (c.id === it.categoryId) ? 'selected' : '';
                optionsHtml += `<option value="${c.id}" ${sel}>${c.emoji || '🏷️'} ${c.name}</option>`;
            });

            row.innerHTML = `
                <td style="padding: 8px 6px; text-align: center; color: #94a3b8; font-weight: 700;">${index + 1}</td>
                <td style="padding: 8px 6px; text-align: center;">
                    <button type="button" class="batch-type-pill ${it.type}" data-index="${index}" title="Chạm để đổi Thu/Chi">
                        ${it.type === 'income' ? '+ Thu' : '- Chi'}
                    </button>
                </td>
                <td style="padding: 8px 6px; text-align: right;">
                    <input type="number" class="batch-amount-input" data-index="${index}" value="${amount}" style="width: 110px; text-align: right; padding: 4px 6px; border: 1px solid #cbd5e1; border-radius: 6px; font-weight: 700; font-size: 12.5px; color: ${it.type === 'income' ? '#059669' : '#dc2626'};" />
                </td>
                <td style="padding: 8px 6px;">
                    <select class="batch-cat-select" data-index="${index}" style="width: 100%; max-width: 155px; padding: 4px; border: 1px solid #cbd5e1; border-radius: 6px; font-size: 11.5px;">
                        ${optionsHtml}
                    </select>
                </td>
                <td style="padding: 8px 6px;">
                    <input type="text" class="batch-note-input" data-index="${index}" value="${it.note || ''}" style="width: 100%; padding: 4px 6px; border: 1px solid #e2e8f0; border-radius: 6px; font-size: 12px;" />
                    ${debtTagHtml}
                    ${subItemsHtml}
                </td>
                <td style="padding: 8px 6px; text-align: center;">
                    <button type="button" class="btn-delete-batch-row" data-index="${index}" style="background: none; border: none; color: #ef4444; cursor: pointer; padding: 4px 6px; border-radius: 4px;" title="Xóa dòng này">
                        <i class="fa-solid fa-trash-can"></i>
                    </button>
                </td>
            `;

            batchPreviewTbody.appendChild(row);
        });

        // Update Summary Cards
        if (batchSumCount) batchSumCount.textContent = currentBatchParsedList.length;
        if (batchSumIncome) batchSumIncome.textContent = Utils.formatCurrency(totalInc);
        if (batchSumExpense) batchSumExpense.textContent = Utils.formatCurrency(totalExp);
        if (batchSaveCountBtn) batchSaveCountBtn.textContent = currentBatchParsedList.length;

        batchPreviewContainer.style.display = 'block';
        if (btnSaveBatchTransactions) {
            btnSaveBatchTransactions.style.display = currentBatchParsedList.length > 0 ? 'inline-flex' : 'none';
        }

        // Add interactive listeners to table elements
        batchPreviewTbody.querySelectorAll('.batch-type-pill').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const idx = parseInt(e.currentTarget.getAttribute('data-index'), 10);
                if (currentBatchParsedList[idx]) {
                    currentBatchParsedList[idx].type = currentBatchParsedList[idx].type === 'income' ? 'expense' : 'income';
                    // Re-predict category
                    const pred = Utils.predictCategory(currentBatchParsedList[idx].note, currentBatchParsedList[idx].type);
                    if (pred) {
                        currentBatchParsedList[idx].categoryId = pred.categoryId;
                        currentBatchParsedList[idx].categoryName = pred.categoryName;
                        currentBatchParsedList[idx].emoji = pred.emoji;
                    }
                    renderBatchPreviewTable();
                }
            });
        });

        batchPreviewTbody.querySelectorAll('.batch-amount-input').forEach(inp => {
            inp.addEventListener('change', (e) => {
                const idx = parseInt(e.currentTarget.getAttribute('data-index'), 10);
                const val = parseFloat(e.currentTarget.value) || 0;
                if (currentBatchParsedList[idx]) {
                    currentBatchParsedList[idx].amount = val;
                    // Recalculate summary only
                    let sInc = 0, sExp = 0;
                    currentBatchParsedList.forEach(item => {
                        if (item.type === 'income') sInc += (Number(item.amount) || 0);
                        else sExp += (Number(item.amount) || 0);
                    });
                    if (batchSumIncome) batchSumIncome.textContent = Utils.formatCurrency(sInc);
                    if (batchSumExpense) batchSumExpense.textContent = Utils.formatCurrency(sExp);
                }
            });
        });

        batchPreviewTbody.querySelectorAll('.batch-cat-select').forEach(sel => {
            sel.addEventListener('change', (e) => {
                const idx = parseInt(e.currentTarget.getAttribute('data-index'), 10);
                if (currentBatchParsedList[idx]) {
                    currentBatchParsedList[idx].categoryId = e.currentTarget.value;
                    const catObj = AppData.getCategoryById(e.currentTarget.value);
                    if (catObj) {
                        currentBatchParsedList[idx].categoryName = catObj.name;
                        currentBatchParsedList[idx].emoji = catObj.emoji;
                    }
                }
            });
        });

        batchPreviewTbody.querySelectorAll('.batch-note-input').forEach(inp => {
            inp.addEventListener('change', (e) => {
                const idx = parseInt(e.currentTarget.getAttribute('data-index'), 10);
                if (currentBatchParsedList[idx]) {
                    currentBatchParsedList[idx].note = e.currentTarget.value;
                }
            });
        });

        batchPreviewTbody.querySelectorAll('.btn-delete-batch-row').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const idx = parseInt(e.currentTarget.getAttribute('data-index'), 10);
                currentBatchParsedList.splice(idx, 1);
                renderBatchPreviewTable();
            });
        });
    }

    // Nút Lưu Tất Cả Vào Sổ
    btnSaveBatchTransactions?.addEventListener('click', async () => {
        if (!currentBatchParsedList || currentBatchParsedList.length === 0) {
            showToast('Không có giao dịch nào để lưu.');
            return;
        }

        try {
            AppData.addBatchTransactions(currentBatchParsedList);
            showToast(`🎉 Đã lưu thành công ${currentBatchParsedList.length} giao dịch vào Sổ!`);
            closeBatchNotesModal();
            currentBatchParsedList = [];
            await loadTransactionsData();
        } catch (err) {
            console.error('Lỗi lưu giao dịch hàng loạt:', err);
            showToast('Đã xảy ra lỗi khi lưu giao dịch.');
        }
    });

    // Nút Test Trên Tài Khoản Demo (1-Click Automated Boss Demo Test)
    btnTestOnDemoAccount?.addEventListener('click', async () => {
        // 1. Kích hoạt Chế độ Demo
        AppData.setDemoMode(true);
        updateDemoModeUI();

        // 2. Điền mẫu và bóc tách
        const sampleTxs = Utils.parseBatchNotes(BOSS_SAMPLE_NOTES);
        
        // 3. Nạp thẳng vào kho giao dịch Demo
        AppData.addBatchTransactions(sampleTxs);

        // 4. Đóng modal & cập nhật giao diện
        closeBatchNotesModal();
        await loadTransactionsData();

        showToast('🌟 Đã chuyển sang Tài Khoản Demo & nạp 4 giao dịch từ ghi chú thành công!');
    });

    // Chuyển đổi bật/tắt Demo Mode
    function updateDemoModeUI() {
        const isDemo = AppData.isDemoMode();
        if (demoModeBanner) {
            demoModeBanner.style.display = isDemo ? 'flex' : 'none';
        }
        if (badgeDemoStatus) {
            badgeDemoStatus.textContent = isDemo ? 'Đang bật ⭐' : 'Trải nghiệm';
            badgeDemoStatus.style.background = isDemo ? '#dcfce7' : '#ede9fe';
            badgeDemoStatus.style.color = isDemo ? '#15803d' : '#7c3aed';
        }
        if (demoModeMenuText) {
            demoModeMenuText.textContent = isDemo ? 'Thoát Chế độ Demo' : 'Chế độ Tài Khoản Demo';
        }
        if (isDemo) {
            if (userDisplayName) userDisplayName.textContent = 'Sếp Demo 🌟';
            if (userDisplayNameMenu) userDisplayNameMenu.textContent = 'Sếp Demo 🌟';
            if (userRoleBadge) userRoleBadge.textContent = 'Owner (Demo) 👑';
            if (currentWsName) currentWsName.textContent = 'Sổ Demo Thu Chi';
        } else {
            if (!State.onlineMode) {
                if (userDisplayName) userDisplayName.textContent = 'Đăng Nhập';
                if (userDisplayNameMenu) userDisplayNameMenu.textContent = 'Chế độ khách';
                if (userRoleBadge) userRoleBadge.textContent = 'Guest 👤';
                if (currentWsName) currentWsName.textContent = 'Home';
            }
        }
    }

    btnToggleDemoMode?.addEventListener('click', async () => {
        const isDemo = AppData.isDemoMode();
        AppData.setDemoMode(!isDemo);
        updateDemoModeUI();
        settingsMenuPopup?.classList.remove('active');
        await loadTransactionsData();
        showToast(AppData.isDemoMode() ? '🌟 Đã bật Chế độ Tài Khoản Demo' : 'Đã thoát Chế độ Demo');
    });

    btnExitDemoMode?.addEventListener('click', async () => {
        AppData.setDemoMode(false);
        updateDemoModeUI();
        await loadTransactionsData();
        showToast('Đã trở về tài khoản bình thường');
    });

    // Kiểm tra khởi tạo trạng thái Demo khi load trang
    if (AppData.isDemoMode()) {
        updateDemoModeUI();
    }

    // ==================== 🤝 CONTROLLER QUẢN LÝ CÔNG NỢ & VAY MƯỢN ====================
    const btnOpenDebtsModal = document.getElementById('btnOpenDebtsModal');
    const btnMenuOpenDebts = document.getElementById('btnMenuOpenDebts');
    const btnDebtQuickSummary = document.getElementById('btnDebtQuickSummary');
    const btnTableOpenDebts = document.getElementById('btnTableOpenDebts');
    const tableDebtsBadge = document.getElementById('tableDebtsBadge');
    const mobileDebtQuickStrip = document.getElementById('mobileDebtQuickStrip');
    const mobileDebtBalanceVal = document.getElementById('mobileDebtBalanceVal');
    const mobileDebtCountBadge = document.getElementById('mobileDebtCountBadge');
    const btnNavDebts = document.getElementById('btnNavDebts');
    const bottomNavDebtsBadge = document.getElementById('bottomNavDebtsBadge');
    const btnNavHome = document.getElementById('btnNavHome');
    const btnNavQuickAdd = document.getElementById('btnNavQuickAdd');
    const btnNavBatchNotes = document.getElementById('btnNavBatchNotes');
    const btnNavReports = document.getElementById('btnNavReports');
    const debtModal = document.getElementById('debtModal');
    const closeDebtModalBtn = document.getElementById('closeDebtModalBtn');
    const btnCloseDebtModal = document.getElementById('btnCloseDebtModal');

    const headerDebtsBadge = document.getElementById('headerDebtsBadge');
    const subDebtBalanceVal = document.getElementById('subDebtBalanceVal');
    const menuDebtsCountBadge = document.getElementById('menuDebtsCountBadge');
    const debtsModalActiveBadge = document.getElementById('debtsModalActiveBadge');

    const debtKpiBorrow = document.getElementById('debtKpiBorrow');
    const debtKpiBorrowCount = document.getElementById('debtKpiBorrowCount');
    const debtKpiLend = document.getElementById('debtKpiLend');
    const debtKpiLendCount = document.getElementById('debtKpiLendCount');
    const debtKpiNet = document.getElementById('debtKpiNet');

    const tabDebtAll = document.getElementById('tabDebtAll');
    const tabDebtBorrow = document.getElementById('tabDebtBorrow');
    const tabDebtLend = document.getElementById('tabDebtLend');
    const tabDebtSettled = document.getElementById('tabDebtSettled');
    const tabCountAll = document.getElementById('tabCountAll');
    const tabCountBorrow = document.getElementById('tabCountBorrow');
    const tabCountLend = document.getElementById('tabCountLend');
    const tabCountSettled = document.getElementById('tabCountSettled');

    const btnToggleAddDebtForm = document.getElementById('btnToggleAddDebtForm');
    const addDebtFormWrap = document.getElementById('addDebtFormWrap');
    const newDebtForm = document.getElementById('newDebtForm');
    const btnCancelAddDebt = document.getElementById('btnCancelAddDebt');

    const debtsCardsList = document.getElementById('debtsCardsList');
    const emptyDebtsState = document.getElementById('emptyDebtsState');

    let currentDebtFilterTab = 'all';

    function openDebtsModal() {
        if (!debtModal) return;
        debtModal.classList.add('active');
        renderDebtsList(currentDebtFilterTab);
    }

    function closeDebtsModal() {
        if (!debtModal) return;
        debtModal.classList.remove('active');
        if (addDebtFormWrap) addDebtFormWrap.style.display = 'none';
        btnNavDebts?.classList.remove('active');
        btnNavHome?.classList.add('active');
        updateDebtsSummaryUI();
    }

    btnOpenDebtsModal?.addEventListener('click', openDebtsModal);
    btnTableOpenDebts?.addEventListener('click', openDebtsModal);
    mobileDebtQuickStrip?.addEventListener('click', openDebtsModal);

    btnNavDebts?.addEventListener('click', () => {
        document.querySelectorAll('.mobile-nav-item').forEach(b => b.classList.remove('active'));
        btnNavDebts?.classList.add('active');
        openDebtsModal();
    });

    btnNavHome?.addEventListener('click', () => {
        document.querySelectorAll('.mobile-nav-item').forEach(b => b.classList.remove('active'));
        btnNavHome?.classList.add('active');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    btnNavQuickAdd?.addEventListener('click', () => {
        openModalForNew('income');
    });

    btnNavBatchNotes?.addEventListener('click', () => {
        document.querySelectorAll('.mobile-nav-item').forEach(b => b.classList.remove('active'));
        btnNavBatchNotes?.classList.add('active');
        openBatchNotesModal();
    });

    btnNavReports?.addEventListener('click', () => {
        document.querySelectorAll('.mobile-nav-item').forEach(b => b.classList.remove('active'));
        btnNavReports?.classList.add('active');
        document.getElementById('btnOpenReports')?.click();
    });

    btnMenuOpenDebts?.addEventListener('click', () => {
        settingsMenuPopup?.classList.remove('active');
        openDebtsModal();
    });
    btnDebtQuickSummary?.addEventListener('click', openDebtsModal);
    closeDebtModalBtn?.addEventListener('click', closeDebtsModal);
    btnCloseDebtModal?.addEventListener('click', closeDebtsModal);

    // Toggle Form thêm nợ
    btnToggleAddDebtForm?.addEventListener('click', () => {
        if (!addDebtFormWrap) return;
        const isHidden = addDebtFormWrap.style.display === 'none' || !addDebtFormWrap.style.display;
        addDebtFormWrap.style.display = isHidden ? 'block' : 'none';
        if (isHidden) {
            document.getElementById('newDebtContact')?.focus();
        }
    });

    btnCancelAddDebt?.addEventListener('click', () => {
        if (addDebtFormWrap) addDebtFormWrap.style.display = 'none';
    });

    // Submit form thêm nợ thủ công
    newDebtForm?.addEventListener('submit', async (e) => {
        e.preventDefault();
        const type = document.getElementById('newDebtType')?.value || 'borrow';
        const contact = document.getElementById('newDebtContact')?.value?.trim();
        const amount = parseFloat(document.getElementById('newDebtAmount')?.value) || 0;
        const dueDate = document.getElementById('newDebtDueDate')?.value || '';
        const note = document.getElementById('newDebtNote')?.value?.trim() || '';

        if (!contact || amount <= 0) {
            showToast('Vui lòng nhập tên đối tác và số tiền hợp lệ!');
            return;
        }

        AppData.addDebt({
            contact,
            type,
            amount,
            dueDate,
            note
        });

        // Tự động đồng bộ tạo giao dịch vào Sổ Thu Chi:
        // Đi vay (borrow) -> Nhận tiền vào ví (income)
        // Cho vay (lend) -> Chi tiền ra (expense)
        const txType = type === 'borrow' ? 'income' : 'expense';
        const txCat = type === 'borrow' ? 'cat_income_other' : 'cat_bills';
        try {
            await saveTransactionUniversal({
                type: txType,
                amount: amount,
                categoryId: txCat,
                note: `[Công nợ] ${type === 'borrow' ? 'Vay từ' : 'Cho vay'} ${contact}${note ? ': ' + note : ''}`,
                date: new Date().toISOString()
            });
        } catch (err) {}

        newDebtForm.reset();
        if (addDebtFormWrap) addDebtFormWrap.style.display = 'none';
        renderDebtsList(currentDebtFilterTab);
        updateDebtsSummaryUI();
        await loadTransactionsData();
        showToast(`✅ Đã thêm khoản nợ cho ${contact} & cập nhật Sổ Thu Chi!`);
    });

    // Tabs filter
    const debtTabButtons = [tabDebtAll, tabDebtBorrow, tabDebtLend, tabDebtSettled];
    debtTabButtons.forEach(btn => {
        btn?.addEventListener('click', (e) => {
            debtTabButtons.forEach(b => b?.classList.remove('active'));
            e.currentTarget.classList.add('active');
            currentDebtFilterTab = e.currentTarget.getAttribute('data-tab') || 'all';
            renderDebtsList(currentDebtFilterTab);
        });
    });

    function updateDebtsSummaryUI() {
        const summary = AppData.getDebtsSummary();
        const debts = AppData.getDebts();

        // Update header & banner badges
        if (subDebtBalanceVal) subDebtBalanceVal.textContent = Utils.formatCurrency(summary.totalBorrow);
        if (mobileDebtBalanceVal) mobileDebtBalanceVal.textContent = Utils.formatCurrency(summary.totalBorrow);
        if (mobileDebtCountBadge) mobileDebtCountBadge.textContent = `${summary.totalActiveCount} khoản`;
        if (menuDebtsCountBadge) menuDebtsCountBadge.textContent = `${summary.totalActiveCount} khoản`;
        if (headerDebtsBadge) {
            headerDebtsBadge.textContent = summary.totalActiveCount;
            headerDebtsBadge.style.display = summary.totalActiveCount > 0 ? 'inline-block' : 'none';
        }
        if (tableDebtsBadge) {
            tableDebtsBadge.textContent = summary.totalActiveCount;
            tableDebtsBadge.style.display = summary.totalActiveCount > 0 ? 'inline-block' : 'none';
        }
        if (bottomNavDebtsBadge) {
            bottomNavDebtsBadge.textContent = summary.totalActiveCount;
            bottomNavDebtsBadge.style.display = summary.totalActiveCount > 0 ? 'inline-block' : 'none';
        }
        if (debtsModalActiveBadge) debtsModalActiveBadge.textContent = `${summary.totalActiveCount} khoản đang nợ`;

        // Update Modal KPIs
        if (debtKpiBorrow) debtKpiBorrow.textContent = Utils.formatCurrency(summary.totalBorrow);
        if (debtKpiBorrowCount) debtKpiBorrowCount.textContent = `${summary.activeBorrowCount} khoản nợ phải trả`;
        if (debtKpiLend) debtKpiLend.textContent = Utils.formatCurrency(summary.totalLend);
        if (debtKpiLendCount) debtKpiLendCount.textContent = `${summary.activeLendCount} khoản nợ phải thu`;
        if (debtKpiNet) {
            debtKpiNet.textContent = Utils.formatCurrency(summary.netDebt);
            debtKpiNet.style.color = summary.netDebt >= 0 ? '#059669' : '#dc2626';
        }

        // Tab counts
        let countBorrow = 0, countLend = 0, countSettled = 0;
        debts.forEach(d => {
            if (d.status === 'settled') countSettled++;
            else if (d.type === 'borrow') countBorrow++;
            else if (d.type === 'lend') countLend++;
        });

        if (tabCountAll) tabCountAll.textContent = debts.length;
        if (tabCountBorrow) tabCountBorrow.textContent = countBorrow;
        if (tabCountLend) tabCountLend.textContent = countLend;
        if (tabCountSettled) tabCountSettled.textContent = countSettled;
    }

    function renderDebtsList(tab = 'all') {
        updateDebtsSummaryUI();
        if (!debtsCardsList || !emptyDebtsState) return;

        let debts = AppData.getDebts();

        // Filter by tab
        if (tab === 'borrow') {
            debts = debts.filter(d => d.type === 'borrow' && d.status === 'active');
        } else if (tab === 'lend') {
            debts = debts.filter(d => d.type === 'lend' && d.status === 'active');
        } else if (tab === 'settled') {
            debts = debts.filter(d => d.status === 'settled');
        }

        if (debts.length === 0) {
            debtsCardsList.style.display = 'none';
            emptyDebtsState.style.display = 'block';
            return;
        }

        debtsCardsList.style.display = 'flex';
        emptyDebtsState.style.display = 'none';
        debtsCardsList.innerHTML = '';

        debts.forEach(debt => {
            const card = document.createElement('div');
            card.className = 'debt-item-card';

            const isBorrow = debt.type === 'borrow';
            const isSettled = debt.status === 'settled';
            const firstLetter = (debt.contact || 'N').charAt(0).toUpperCase();

            const orig = Number(debt.originalAmount) || 0;
            const paid = Number(debt.paidAmount) || 0;
            const remain = Number(debt.remainingAmount) || 0;
            const percentPaid = orig > 0 ? Math.min(100, Math.round((paid / orig) * 100)) : 100;

            // Badges
            let typeBadgeHtml = '';
            if (isSettled) {
                typeBadgeHtml = `<span class="debt-badge-settled"><i class="fa-solid fa-check"></i> Đã hoàn tất</span>`;
            } else if (isBorrow) {
                typeBadgeHtml = `<span class="debt-badge-borrow"><i class="fa-solid fa-arrow-down-long"></i> Tôi nợ (Đi vay)</span>`;
            } else {
                typeBadgeHtml = `<span class="debt-badge-lend"><i class="fa-solid fa-arrow-up-long"></i> Nợ tôi (Cho vay)</span>`;
            }

            // History items
            let historyHtml = '';
            if (Array.isArray(debt.history) && debt.history.length > 0) {
                historyHtml = debt.history.map(h => {
                    const hActText = h.action === 'borrow' ? 'Mượn' : (h.action === 'repay' ? 'Trả / Cấn trừ' : (h.action === 'lend' ? 'Cho vay' : (h.action === 'collect' ? 'Thu hồi' : 'Tất toán')));
                    const hSign = (h.action === 'borrow' || h.action === 'lend') ? '+' : '-';
                    const hColor = (h.action === 'borrow' || h.action === 'lend') ? '#dc2626' : '#059669';
                    const dStr = h.date ? new Date(h.date).toLocaleDateString('vi-VN') : '';
                    return `
                        <div style="display: flex; justify-content: space-between; align-items: center; padding: 4px 0; border-bottom: 1px dashed #f1f5f9; font-size: 11.5px;">
                            <span style="color: #64748b;">${dStr} • ${h.note || hActText}</span>
                            <span style="font-weight: 700; color: ${hColor};">${hSign}${Utils.formatCurrency(h.amount)}</span>
                        </div>
                    `;
                }).join('');
            }

            card.innerHTML = `
                <div style="display: flex; align-items: flex-start; justify-content: space-between; gap: 10px; margin-bottom: 8px;">
                    <div style="display: flex; align-items: center; gap: 10px;">
                        <div class="debt-contact-avatar ${isBorrow ? 'debt-avatar-borrow' : 'debt-avatar-lend'}">
                            ${firstLetter}
                        </div>
                        <div>
                            <div style="display: flex; align-items: center; gap: 8px;">
                                <span style="font-weight: 800; font-size: 14.5px; color: #0f172a;">${debt.contact}</span>
                                ${typeBadgeHtml}
                            </div>
                            <div style="font-size: 11.5px; color: #64748b; margin-top: 2px;">
                                ${debt.note || 'Không có ghi chú'}
                            </div>
                        </div>
                    </div>

                    <div style="text-align: right;">
                        <div style="font-size: 11px; color: #64748b; font-weight: 600;">CÒN NỢ LẠI:</div>
                        <div style="font-size: 17px; font-weight: 800; color: ${isSettled ? '#64748b' : (isBorrow ? '#dc2626' : '#059669')};">
                            ${isSettled ? '0 ₫' : Utils.formatCurrency(remain)}
                        </div>
                    </div>
                </div>

                <!-- Progress Bar -->
                <div class="debt-progress-bg">
                    <div class="debt-progress-fill" style="width: ${percentPaid}%;"></div>
                </div>
                <div style="display: flex; justify-content: space-between; font-size: 11px; color: #64748b; font-weight: 600; margin-bottom: 8px;">
                    <span>Gốc: <b>${Utils.formatCurrency(orig)}</b></span>
                    <span>Đã trả/cấn trừ: <b style="color: #059669;">${Utils.formatCurrency(paid)}</b> (${percentPaid}%)</span>
                </div>

                <!-- History toggle & Actions -->
                <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 6px; padding-top: 6px; border-top: 1px solid #f8fafc;">
                    <button type="button" class="btn-toggle-debt-history" style="background: none; border: none; font-size: 11.5px; color: #2563eb; font-weight: 700; cursor: pointer; padding: 4px 0;">
                        <i class="fa-solid fa-clock-rotate-left"></i> Lịch sử (${debt.history?.length || 0}) <i class="fa-solid fa-chevron-down caret-h" style="font-size: 9px;"></i>
                    </button>

                    <div style="display: flex; gap: 5px; flex-wrap: wrap;">
                        ${!isSettled ? `
                            <button type="button" class="btn-debt-action-mini btn-debt-repay" data-id="${debt.id}" title="Ghi nhận trả nợ hoặc cấn trừ tiền">
                                <i class="fa-solid fa-money-bill-wave"></i> ${isBorrow ? 'Trả nợ / Cấn trừ' : 'Thu hồi nợ'}
                            </button>
                            <button type="button" class="btn-debt-action-mini btn-debt-more" data-id="${debt.id}" title="Ghi nhận mượn thêm hoặc cho vay thêm">
                                <i class="fa-solid fa-plus"></i> ${isBorrow ? 'Mượn thêm' : 'Cho vay thêm'}
                            </button>
                            <button type="button" class="btn-debt-action-mini btn-debt-settle" data-id="${debt.id}" title="Chốt hoàn tất xong nợ">
                                <i class="fa-solid fa-check"></i> Tất toán
                            </button>
                        ` : ''}
                        <button type="button" class="btn-debt-action-mini btn-debt-delete" data-id="${debt.id}" title="Xóa khoản nợ này">
                            <i class="fa-solid fa-trash-can"></i>
                        </button>
                    </div>
                </div>

                <!-- Accordion History details -->
                <div class="debt-history-box" style="display: none; background: #f8fafc; border-radius: 8px; padding: 8px 12px; margin-top: 8px;">
                    ${historyHtml}
                </div>
            `;

            // Toggle history
            const btnToggleHist = card.querySelector('.btn-toggle-debt-history');
            const histBox = card.querySelector('.debt-history-box');
            const caretH = card.querySelector('.caret-h');
            btnToggleHist?.addEventListener('click', () => {
                const isShow = histBox.style.display === 'block';
                histBox.style.display = isShow ? 'none' : 'block';
                if (caretH) caretH.style.transform = isShow ? 'rotate(0deg)' : 'rotate(180deg)';
            });

            // Action: Trả nợ / Cấn trừ
            card.querySelector('.btn-debt-repay')?.addEventListener('click', async (e) => {
                const id = e.currentTarget.getAttribute('data-id');
                const target = debts.find(d => d.id === id);
                if (!target) return;

                const isBorrow = target.type === 'borrow';
                const actionLabel = isBorrow ? 'trả nợ / cấn trừ cho' : 'thu hồi nợ từ';
                const inputStr = prompt(`Nhập số tiền ${actionLabel} ${target.contact} (Còn lại: ${Utils.formatCurrency(target.remainingAmount)}):`, target.remainingAmount);
                if (inputStr === null) return;
                const amt = Utils.parseInputAmount(inputStr);
                if (amt <= 0) {
                    showToast('Số tiền không hợp lệ!');
                    return;
                }

                const defaultNote = isBorrow ? `Trả nợ cho ${target.contact}` : `Thu nợ từ ${target.contact}`;
                const noteStr = prompt('Nhập nội dung / lý do (ví dụ: Điện nước cấn trừ, Chuyển khoản...):', defaultNote) || defaultNote;
                AppData.recordDebtRepayment(id, amt, noteStr);

                // Đồng bộ Sổ Thu Chi: Tôi trả nợ -> Chi tiền (expense); Tôi thu nợ -> Thu tiền (income)
                const txType = isBorrow ? 'expense' : 'income';
                const txCat = isBorrow ? 'cat_bills' : 'cat_income_other';
                try {
                    await saveTransactionUniversal({
                        type: txType,
                        amount: amt,
                        categoryId: txCat,
                        note: `[Công nợ] ${noteStr}`,
                        date: new Date().toISOString()
                    });
                } catch (err) {}

                renderDebtsList(currentDebtFilterTab);
                updateDebtsSummaryUI();
                await loadTransactionsData();
                showToast(`✅ Đã ghi nhận ${Utils.formatCurrency(amt)} cho ${target.contact} & đồng bộ Sổ Thu Chi!`);
            });

            // Action: Mượn thêm
            card.querySelector('.btn-debt-more')?.addEventListener('click', async (e) => {
                const id = e.currentTarget.getAttribute('data-id');
                const target = debts.find(d => d.id === id);
                if (!target) return;

                const isBorrow = target.type === 'borrow';
                const actionLabel = isBorrow ? 'mượn thêm từ' : 'cho vay thêm đối với';
                const inputStr = prompt(`Nhập số tiền ${actionLabel} ${target.contact}:`, '500000');
                if (inputStr === null) return;
                const amt = Utils.parseInputAmount(inputStr);
                if (amt <= 0) {
                    showToast('Số tiền không hợp lệ!');
                    return;
                }

                const defaultNote = isBorrow ? `Mượn thêm từ ${target.contact}` : `Cho ${target.contact} vay thêm`;
                const noteStr = prompt('Nhập ghi chú mượn thêm:', defaultNote) || defaultNote;
                AppData.recordDebtBorrowMore(id, amt, noteStr);

                // Đồng bộ Sổ Thu Chi: Mượn thêm -> Thu tiền (income); Cho vay thêm -> Chi tiền (expense)
                const txType = isBorrow ? 'income' : 'expense';
                const txCat = isBorrow ? 'cat_income_other' : 'cat_bills';
                try {
                    await saveTransactionUniversal({
                        type: txType,
                        amount: amt,
                        categoryId: txCat,
                        note: `[Công nợ] ${noteStr}`,
                        date: new Date().toISOString()
                    });
                } catch (err) {}

                renderDebtsList(currentDebtFilterTab);
                updateDebtsSummaryUI();
                await loadTransactionsData();
                showToast(`✅ Đã ghi nhận thêm ${Utils.formatCurrency(amt)} & đồng bộ Sổ Thu Chi!`);
            });

            // Action: Tất toán
            card.querySelector('.btn-debt-settle')?.addEventListener('click', async (e) => {
                const id = e.currentTarget.getAttribute('data-id');
                const target = debts.find(d => d.id === id);
                if (!target) return;

                const remain = target.remainingAmount;
                if (confirm(`Xác nhận chốt tất toán xong khoản nợ của ${target.contact}?`)) {
                    AppData.settleDebt(id);

                    if (remain > 0) {
                        const isBorrow = target.type === 'borrow';
                        const txType = isBorrow ? 'expense' : 'income';
                        const txCat = isBorrow ? 'cat_bills' : 'cat_income_other';
                        try {
                            await saveTransactionUniversal({
                                type: txType,
                                amount: remain,
                                categoryId: txCat,
                                note: `[Tất toán công nợ] Hoàn tất nợ với ${target.contact}`,
                                date: new Date().toISOString()
                            });
                        } catch (err) {}
                    }

                    renderDebtsList(currentDebtFilterTab);
                    updateDebtsSummaryUI();
                    await loadTransactionsData();
                    showToast(`🎉 Đã tất toán xong khoản nợ của ${target.contact}!`);
                }
            });

            // Action: Xóa
            card.querySelector('.btn-debt-delete')?.addEventListener('click', async (e) => {
                const id = e.currentTarget.getAttribute('data-id');
                const target = debts.find(d => d.id === id);
                if (!target) return;

                if (confirm(`Bạn có chắc chắn muốn xóa khoản nợ của ${target.contact}?`)) {
                    AppData.deleteDebt(id);
                    renderDebtsList(currentDebtFilterTab);
                    updateDebtsSummaryUI();
                    await loadTransactionsData();
                    showToast('Đã xóa khoản nợ.');
                }
            });

            debtsCardsList.appendChild(card);
        });
    }

    // Khởi tạo hiển thị badges công nợ ngay khi nạp trang
    updateDebtsSummaryUI();

    function showToast(msg) {
        const toast = document.getElementById('toastPopup');
        if (!toast) return;
        toast.textContent = msg;
        toast.style.display = 'block';
        setTimeout(() => { toast.style.display = 'none'; }, 3500);
    }
});
