import React from 'react';
import { useDispatch } from 'react-redux';
import { CheckCircle, Trash2 } from 'lucide-react';
import { markAllAsRead, markAsRead, deleteMessage } from '../../../store/slices/messageSlice';

const MessageManager = ({ messages, unreadMessagesCount }) => {
    const dispatch = useDispatch();

    return (
        <div className="admin-section">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <h2 className="admin-section-title">Messages Clients</h2>
                {unreadMessagesCount > 0 && (
                    <button
                        onClick={() => dispatch(markAllAsRead())}
                        className="btn-primary"
                        style={{ padding: '8px 16px', fontSize: '12px' }}
                    >
                        Tout marquer comme lu
                    </button>
                )}
            </div>
            {messages.length === 0 ? (
                <p style={{ textAlign: 'center', padding: '40px', color: 'var(--text-gray)' }}>Aucun message pour le moment.</p>
            ) : (
                <div className="admin-table-wrapper">
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th className="admin-th">Client</th>
                                <th className="admin-th">Sujet</th>
                                <th className="admin-th">Message</th>
                                <th className="admin-th">Date</th>
                                <th className="admin-th">Status</th>
                                <th className="admin-th">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {messages.slice().reverse().map(msg => (
                                <tr key={msg.id} style={{ opacity: msg.isRead ? 0.7 : 1 }}>
                                    <td className="admin-td">
                                        <div style={{ fontWeight: 700 }}>{msg.name}</div>
                                        <div style={{ fontSize: '11px', color: 'var(--text-gray)' }}>{msg.email}</div>
                                    </td>
                                    <td className="admin-td" style={{ fontWeight: 600 }}>{msg.subject}</td>
                                    <td className="admin-td" style={{ maxWidth: '300px', fontSize: '13px' }}>{msg.message}</td>
                                    <td className="admin-td" style={{ fontSize: '12px' }}>{msg.date}</td>
                                    <td className="admin-td">
                                        {!msg.isRead ? (
                                            <span style={{ background: 'rgba(147, 51, 234, 0.1)', color: 'var(--primary)', padding: '4px 8px', borderRadius: '4px', fontSize: '11px', fontWeight: 700 }}>Nouveau</span>
                                        ) : (
                                            <span style={{ color: 'var(--text-gray)', fontSize: '11px' }}>Lu</span>
                                        )}
                                    </td>
                                    <td className="admin-td">
                                        <div style={{ display: 'flex', gap: '8px' }}>
                                            {!msg.isRead && (
                                                <button
                                                    onClick={() => dispatch(markAsRead(msg.id))}
                                                    className="admin-action-btn edit"
                                                    title="Marquer comme lu"
                                                >
                                                    <CheckCircle size={14} />
                                                </button>
                                            )}
                                            <button
                                                onClick={() => dispatch(deleteMessage(msg.id))}
                                                className="admin-action-btn delete"
                                                title="Supprimer"
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
            )}
        </div>
    );
};

export default MessageManager;
