import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { CheckCircle, Trash2, Search, ChevronLeft, ChevronRight } from 'lucide-react';
import { markAllAsRead, markAsRead, deleteMessage } from '../../../store/slices/messageSlice';

const MessageManager = ({ messages, unreadMessagesCount }) => {
    const { t } = useTranslation();
    const dispatch = useDispatch();

    // Filters & Pagination State
    const [currentPage, setCurrentPage] = useState(1);
    const [searchQuery, setSearchQuery] = useState('');
    const [activeFilter, setActiveFilter] = useState('all');
    const messagesPerPage = 10;

    const filters = [
        { id: 'all', label: t('orders.all') },
        { id: 'new', label: t('admin.new') },
        { id: 'read', label: t('admin.read') }
    ];

    // 1. Apply Search & Status Filter
    const filteredMessages = messages.slice().reverse().filter(msg => {
        // Search Filter
        const name = msg.name.toLowerCase();
        const email = msg.email.toLowerCase();
        const subject = msg.subject.toLowerCase();
        const content = msg.message.toLowerCase();
        const matchesSearch = name.includes(searchQuery.toLowerCase()) ||
            email.includes(searchQuery.toLowerCase()) ||
            subject.includes(searchQuery.toLowerCase()) ||
            content.includes(searchQuery.toLowerCase());

        if (!matchesSearch) return false;

        // Status Filter
        if (activeFilter === 'new') return !msg.isRead;
        if (activeFilter === 'read') return msg.isRead;

        return true;
    });

    // 2. Pagination Logic
    const totalPages = Math.ceil(filteredMessages.length / messagesPerPage);
    const indexOfLastMessage = currentPage * messagesPerPage;
    const indexOfFirstMessage = indexOfLastMessage - messagesPerPage;
    const currentMessages = filteredMessages.slice(indexOfFirstMessage, indexOfLastMessage);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleFilterChange = (filterId) => {
        setActiveFilter(filterId);
        setCurrentPage(1);
    };

    return (
        <div className="admin-section">
            <div className="admin-orders-header">
                <div className="admin-orders-top">
                    <h2 className="admin-section-title">{t('admin.customer_messages')}</h2>
                    <div className="admin-order-search" style={{ maxWidth: '400px' }}>
                        <Search size={16} />
                        <input
                            type="text"
                            placeholder={t('common.search')}
                            value={searchQuery}
                            onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                        />
                    </div>
                    {unreadMessagesCount > 0 && (
                        <button
                            onClick={() => dispatch(markAllAsRead())}
                            className="btn-primary"
                            style={{ padding: '8px 16px', fontSize: '12px' }}
                        >
                            {t('admin.mark_all_read')}
                        </button>
                    )}
                </div>

                <div className="admin-presets-scroll">
                    <div className="admin-preset-tabs">
                        {filters.map(f => (
                            <button
                                key={f.id}
                                className={`preset-tab ${activeFilter === f.id ? 'active' : ''}`}
                                onClick={() => handleFilterChange(f.id)}
                            >
                                {f.label}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {filteredMessages.length === 0 ? (
                <p style={{ textAlign: 'center', padding: '40px', color: 'var(--text-gray)' }}>
                    {searchQuery ? t('admin.no_results_found') : t('admin.no_messages')}
                </p>
            ) : (
                <>
                    {/* Desktop Table View */}
                    <div className="admin-table-wrapper hide-mobile-flex">
                        <table className="admin-table">
                            <thead>
                                <tr>
                                    <th className="admin-th">{t('admin.customer')}</th>
                                    <th className="admin-th">{t('admin.subject')}</th>
                                    <th className="admin-th">{t('admin.message')}</th>
                                    <th className="admin-th">{t('admin.date')}</th>
                                    <th className="admin-th">{t('admin.status')}</th>
                                    <th className="admin-th">{t('admin.action')}</th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentMessages.map(msg => (
                                    <tr key={msg.id} style={{ opacity: msg.isRead ? 0.7 : 1 }}>
                                        <td className="admin-td">
                                            <div style={{ fontWeight: 700 }}>{msg.name}</div>
                                            <div style={{ fontSize: '11px', color: 'var(--text-gray)' }}>{msg.email}</div>
                                        </td>
                                        <td className="admin-td" style={{ fontWeight: 600 }}>{msg.subject}</td>
                                        <td className="admin-td">
                                            <div className="message-content-preview">{msg.message}</div>
                                        </td>
                                        <td className="admin-td" style={{ fontSize: '12px' }}>{msg.date}</td>
                                        <td className="admin-td">
                                            {!msg.isRead ? (
                                                <span className="message-status-badge new">{t('admin.new')}</span>
                                            ) : (
                                                <span className="message-status-badge read">{t('admin.read')}</span>
                                            )}
                                        </td>
                                        <td className="admin-td">
                                            <div className="admin-table-actions">
                                                {!msg.isRead && (
                                                    <button
                                                        onClick={() => dispatch(markAsRead(msg.id))}
                                                        className="admin-action-btn edit"
                                                        title={t('admin.mark_read')}
                                                    >
                                                        <CheckCircle size={14} />
                                                    </button>
                                                )}
                                                <button
                                                    onClick={() => dispatch(deleteMessage(msg.id))}
                                                    className="admin-action-btn delete"
                                                    title={t('common.delete')}
                                                >
                                                    <Trash2 size={14} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Mobile Card View */}
                    <div className="admin-mobile-cards show-mobile">
                        {currentMessages.map(msg => (
                            <div key={msg.id} className="admin-mobile-card message-card" style={{ opacity: msg.isRead ? 0.8 : 1 }}>
                                <div className="admin-mobile-card-top">
                                    <div className="admin-mobile-card-info">
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                                            <div>
                                                <h4 className="admin-mobile-card-name" style={{ margin: 0 }}>{msg.name}</h4>
                                                <p style={{ fontSize: '12px', color: 'var(--text-gray)', margin: 0 }}>{msg.email}</p>
                                            </div>
                                            <span style={{ fontSize: '11px', color: 'var(--text-gray)' }}>{msg.date}</span>
                                        </div>

                                        <div style={{ marginBottom: '10px' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                                                {!msg.isRead && (
                                                    <span className="message-status-badge new" style={{ fontSize: '10px' }}>{t('admin.new')}</span>
                                                )}
                                                <span style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-main)' }}>{msg.subject}</span>
                                            </div>
                                            <div style={{ fontSize: '13px', color: 'var(--text-main)', margin: '0', lineHeight: '1.6', background: 'var(--bg-app)', padding: '12px', borderRadius: '12px', border: '1px solid var(--border-subtle)', wordBreak: 'break-word' }}>
                                                {msg.message}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="admin-mobile-card-actions">
                                    {!msg.isRead && (
                                        <button
                                            onClick={() => dispatch(markAsRead(msg.id))}
                                            className="admin-mobile-action-btn edit"
                                        >
                                            <CheckCircle size={16} /> {t('admin.mark_read')}
                                        </button>
                                    )}
                                    <button
                                        onClick={() => dispatch(deleteMessage(msg.id))}
                                        className="admin-mobile-action-btn delete"
                                        style={{ gridColumn: msg.isRead ? 'span 2' : 'auto' }}
                                    >
                                        <Trash2 size={16} /> {t('common.delete')}
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Pagination UI */}
                    {totalPages > 1 && (
                        <div className="admin-pagination">
                            <button
                                disabled={currentPage === 1}
                                onClick={() => handlePageChange(currentPage - 1)}
                                className="pagination-btn"
                            >
                                <ChevronLeft size={18} />
                            </button>

                            <div className="pagination-numbers">
                                {[...Array(totalPages)].map((_, i) => (
                                    <button
                                        key={i + 1}
                                        onClick={() => handlePageChange(i + 1)}
                                        className={`pagination-number ${currentPage === i + 1 ? 'active' : ''}`}
                                    >
                                        {i + 1}
                                    </button>
                                ))}
                            </div>

                            <button
                                disabled={currentPage === totalPages}
                                onClick={() => handlePageChange(currentPage + 1)}
                                className="pagination-btn"
                            >
                                <ChevronRight size={18} />
                            </button>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default MessageManager;

