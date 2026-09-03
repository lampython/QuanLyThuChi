/**
 * SmartFinance Pro - Interactive Analytics & Charts Manager (Chart.js)
 */

const AppCharts = {
    cashFlowChartInstance: null,
    categoryDoughnutChartInstance: null,
    trendChartInstance: null,
    incomeChartInstance: null,

    /**
     * Lấy màu sắc trục tọa độ và lưới theo Theme hiện tại
     */
    getThemeColors() {
        const isDark = document.documentElement.getAttribute('data-theme') !== 'light';
        return {
            textColor: isDark ? '#9ca3af' : '#4b5563',
            gridColor: isDark ? 'rgba(255, 255, 255, 0.06)' : 'rgba(0, 0, 0, 0.06)',
            tooltipBg: isDark ? '#1f2937' : '#ffffff',
            tooltipTitle: isDark ? '#ffffff' : '#111827',
            tooltipBody: isDark ? '#e5e7eb' : '#374151'
        };
    },

    /**
     * Khởi tạo và cập nhật Biểu đồ Dòng Tiền (Thu vs Chi)
     */
    renderCashFlowChart(transactions) {
        const ctx = document.getElementById('cashFlowChart');
        if (!ctx) return;

        const colors = this.getThemeColors();

        // Nhóm dữ liệu theo ngày hoặc tuần gần nhất
        const now = new Date();
        const days = [];
        const incomeData = [];
        const expenseData = [];

        // Tạo mốc 7 ngày gần nhất
        for (let i = 6; i >= 0; i--) {
            const d = new Date();
            d.setDate(now.getDate() - i);
            const dateStr = d.toISOString().slice(0, 10);
            const dayLabel = `${d.getDate()}/${d.getMonth() + 1}`;
            days.push(dayLabel);

            // Tính tổng thu và chi trong ngày
            const dayTxs = transactions.filter(t => (t.date || '').startsWith(dateStr));
            const dayIncome = dayTxs.filter(t => t.type === 'income').reduce((sum, t) => sum + (Number(t.amount) || 0), 0);
            const dayExpense = dayTxs.filter(t => t.type === 'expense').reduce((sum, t) => sum + (Number(t.amount) || 0), 0);

            incomeData.push(dayIncome);
            expenseData.push(dayExpense);
        }

        if (this.cashFlowChartInstance) {
            this.cashFlowChartInstance.destroy();
        }

        this.cashFlowChartInstance = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: days,
                datasets: [
                    {
                        label: 'Thu nhập',
                        data: incomeData,
                        backgroundColor: '#10b981',
                        borderRadius: 6,
                        barPercentage: 0.6,
                        categoryPercentage: 0.6
                    },
                    {
                        label: 'Chi tiêu',
                        data: expenseData,
                        backgroundColor: '#ef4444',
                        borderRadius: 6,
                        barPercentage: 0.6,
                        categoryPercentage: 0.6
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false },
                    tooltip: {
                        backgroundColor: colors.tooltipBg,
                        titleColor: colors.tooltipTitle,
                        bodyColor: colors.tooltipBody,
                        borderColor: 'rgba(255,255,255,0.1)',
                        borderWidth: 1,
                        padding: 10,
                        callbacks: {
                            label: function(context) {
                                return ` ${context.dataset.label}: ${Utils.formatCurrency(context.raw, AppData.state.currency)}`;
                            }
                        }
                    }
                },
                scales: {
                    x: {
                        grid: { display: false },
                        ticks: { color: colors.textColor, font: { family: 'Plus Jakarta Sans', size: 12 } }
                    },
                    y: {
                        grid: { color: colors.gridColor },
                        ticks: {
                            color: colors.textColor,
                            font: { family: 'JetBrains Mono', size: 11 },
                            callback: function(val) {
                                return Utils.formatCompactMoney(val, AppData.state.currency);
                            }
                        }
                    }
                }
            }
        });
    },

    /**
     * Khởi tạo và cập nhật Biểu đồ Doughnut Phân Bổ Chi Tiêu
     */
    renderCategoryDoughnut(transactions) {
        const ctx = document.getElementById('categoryDoughnutChart');
        const legendContainer = document.getElementById('categoryLegendList');
        if (!ctx) return;

        const colors = this.getThemeColors();

        // Lọc các giao dịch Chi tiêu
        const expenses = transactions.filter(t => t.type === 'expense');
        const categoryMap = {};

        expenses.forEach(t => {
            const cat = AppData.getCategoryById(t.categoryId, 'expense');
            const catName = cat ? cat.name : 'Khác';
            const catColor = cat ? cat.color : '#6b7280';

            if (!categoryMap[catName]) {
                categoryMap[catName] = { amount: 0, color: catColor };
            }
            categoryMap[catName].amount += Number(t.amount) || 0;
        });

        const labels = Object.keys(categoryMap);
        const dataValues = labels.map(l => categoryMap[l].amount);
        const backgroundColors = labels.map(l => categoryMap[l].color);
        const totalExpense = dataValues.reduce((sum, val) => sum + val, 0);

        if (this.categoryDoughnutChartInstance) {
            this.categoryDoughnutChartInstance.destroy();
        }

        if (labels.length === 0) {
            // Trường hợp chưa có dữ liệu chi
            if (legendContainer) {
                legendContainer.innerHTML = '<div style="text-align:center; color: var(--text-muted); font-size: 12px; padding: 20px 0;">Chưa phát sinh chi tiêu trong kỳ</div>';
            }
            return;
        }

        this.categoryDoughnutChartInstance = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: labels,
                datasets: [{
                    data: dataValues,
                    backgroundColor: backgroundColors,
                    borderWidth: 2,
                    borderColor: colors.tooltipBg,
                    hoverOffset: 6
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                cutout: '72%',
                plugins: {
                    legend: { display: false },
                    tooltip: {
                        backgroundColor: colors.tooltipBg,
                        titleColor: colors.tooltipTitle,
                        bodyColor: colors.tooltipBody,
                        padding: 10,
                        callbacks: {
                            label: function(context) {
                                const val = context.raw;
                                const percent = totalExpense > 0 ? ((val / totalExpense) * 100).toFixed(1) : 0;
                                return ` ${context.label}: ${Utils.formatCurrency(val, AppData.state.currency)} (${percent}%)`;
                            }
                        }
                    }
                }
            }
        });

        // Vẽ danh sách Chú thích bên dưới
        if (legendContainer) {
            legendContainer.innerHTML = labels.map((label, i) => {
                const amount = dataValues[i];
                const percent = totalExpense > 0 ? ((amount / totalExpense) * 100).toFixed(1) : 0;
                return `
                    <div class="legend-row">
                        <div class="legend-row-left">
                            <span class="legend-row-color" style="background-color: ${backgroundColors[i]};"></span>
                            <span>${label}</span>
                        </div>
                        <span style="font-family: var(--font-mono); font-weight: 600;">
                            ${Utils.formatCompactMoney(amount, AppData.state.currency)} <small class="text-muted">(${percent}%)</small>
                        </span>
                    </div>
                `;
            }).join('');
        }
    },

    /**
     * Khởi tạo Biểu đồ Xu Hướng Báo Cáo Phân Tích (Analytics Page)
     */
    renderAnalyticsCharts(transactions) {
        const trendCtx = document.getElementById('analyticsTrendChart');
        const incomeCtx = document.getElementById('incomeCategoryChart');
        const colors = this.getThemeColors();

        // 1. Trend Chart
        if (trendCtx) {
            if (this.trendChartInstance) this.trendChartInstance.destroy();

            const months = ['Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6', 'Tháng 7', 'Tháng 8'];
            const incomeSeries = [24000000, 26500000, 25000000, 31000000, 29000000, 38000000];
            const expenseSeries = [14000000, 16000000, 13500000, 19000000, 15800000, 18500000];
            const savingsSeries = incomeSeries.map((inc, i) => inc - expenseSeries[i]);

            this.trendChartInstance = new Chart(trendCtx, {
                type: 'line',
                data: {
                    labels: months,
                    datasets: [
                        {
                            label: 'Thu nhập',
                            data: incomeSeries,
                            borderColor: '#10b981',
                            backgroundColor: 'rgba(16, 185, 129, 0.08)',
                            fill: true,
                            tension: 0.35
                        },
                        {
                            label: 'Chi tiêu',
                            data: expenseSeries,
                            borderColor: '#ef4444',
                            backgroundColor: 'rgba(239, 68, 68, 0.08)',
                            fill: true,
                            tension: 0.35
                        },
                        {
                            label: 'Tiết kiệm ròng',
                            data: savingsSeries,
                            borderColor: '#3b82f6',
                            borderDash: [5, 5],
                            fill: false,
                            tension: 0.35
                        }
                    ]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            labels: { color: colors.textColor, font: { family: 'Plus Jakarta Sans', size: 12 } }
                        },
                        tooltip: {
                            backgroundColor: colors.tooltipBg,
                            titleColor: colors.tooltipTitle,
                            bodyColor: colors.tooltipBody,
                            callbacks: {
                                label: function(context) {
                                    return ` ${context.dataset.label}: ${Utils.formatCurrency(context.raw, AppData.state.currency)}`;
                                }
                            }
                        }
                    },
                    scales: {
                        x: {
                            grid: { color: colors.gridColor },
                            ticks: { color: colors.textColor }
                        },
                        y: {
                            grid: { color: colors.gridColor },
                            ticks: {
                                color: colors.textColor,
                                font: { family: 'JetBrains Mono' },
                                callback: val => Utils.formatCompactMoney(val, AppData.state.currency)
                            }
                        }
                    }
                }
            });
        }

        // 2. Income Breakdown Chart
        if (incomeCtx) {
            if (this.incomeChartInstance) this.incomeChartInstance.destroy();

            const incomes = transactions.filter(t => t.type === 'income');
            const incMap = {};
            incomes.forEach(t => {
                const cat = AppData.getCategoryById(t.categoryId, 'income');
                const catName = cat ? cat.name : 'Khác';
                incMap[catName] = (incMap[catName] || 0) + (Number(t.amount) || 0);
            });

            const incLabels = Object.keys(incMap).length ? Object.keys(incMap) : ['Lương chính', 'Thưởng', 'Làm thêm'];
            const incData = Object.keys(incMap).length ? Object.values(incMap) : [28000000, 6500000, 3500000];

            this.incomeChartInstance = new Chart(incomeCtx, {
                type: 'polarArea',
                data: {
                    labels: incLabels,
                    datasets: [{
                        data: incData,
                        backgroundColor: [
                            'rgba(16, 185, 129, 0.7)',
                            'rgba(59, 130, 246, 0.7)',
                            'rgba(245, 158, 11, 0.7)',
                            'rgba(139, 92, 246, 0.7)',
                            'rgba(236, 72, 153, 0.7)'
                        ]
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            position: 'bottom',
                            labels: { color: colors.textColor, font: { size: 11 } }
                        }
                    },
                    scales: {
                        r: {
                            ticks: { display: false },
                            grid: { color: colors.gridColor }
                        }
                    }
                }
            });
        }
    },

    /**
     * Cập nhật màu lại cho toàn bộ Chart khi đổi Theme Sáng / Tối
     */
    updateTheme(transactions) {
        this.renderCashFlowChart(transactions);
        this.renderCategoryDoughnut(transactions);
        this.renderAnalyticsCharts(transactions);
    }
};
