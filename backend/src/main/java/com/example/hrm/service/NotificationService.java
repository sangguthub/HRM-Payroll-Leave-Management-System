package com.example.hrm.service;

import com.example.hrm.dto.notification.NotificationResponseDto;
import com.example.hrm.entity.User;
import com.example.hrm.enums.NotificationType;

import java.util.List;

public interface NotificationService {
    List<NotificationResponseDto> getUserNotifications(Long userId);
    long getUnreadCount(Long userId);
    NotificationResponseDto markAsRead(Long id, Long userId);
    void markAllAsRead(Long userId);
    void createNotification(User user, String title, String message, NotificationType type);
}
