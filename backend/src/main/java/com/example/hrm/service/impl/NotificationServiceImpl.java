package com.example.hrm.service.impl;

import com.example.hrm.dto.notification.NotificationResponseDto;
import com.example.hrm.entity.Notification;
import com.example.hrm.entity.User;
import com.example.hrm.enums.NotificationType;
import com.example.hrm.exception.ResourceNotFoundException;
import com.example.hrm.repository.NotificationRepository;
import com.example.hrm.service.NotificationService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class NotificationServiceImpl implements NotificationService {

    private final NotificationRepository notificationRepository;

    @Override
    public List<NotificationResponseDto> getUserNotifications(Long userId) {
        return notificationRepository.findByUserIdOrderByCreatedAtDesc(userId).stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Override
    public long getUnreadCount(Long userId) {
        return notificationRepository.countByUserIdAndReadStatusFalse(userId);
    }

    @Override
    @Transactional
    public NotificationResponseDto markAsRead(Long id, Long userId) {
        Notification notification = notificationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Notification not found with ID: " + id));

        if (!notification.getUser().getId().equals(userId)) {
            throw new org.springframework.security.access.AccessDeniedException("Unauthorized to access this notification");
        }

        notification.setReadStatus(true);
        Notification saved = notificationRepository.save(notification);
        return mapToDto(saved);
    }

    @Override
    @Transactional
    public void markAllAsRead(Long userId) {
        List<Notification> userNotifications = notificationRepository.findByUserIdOrderByCreatedAtDesc(userId);
        for (Notification n : userNotifications) {
            if (!n.getReadStatus()) {
                n.setReadStatus(true);
                notificationRepository.save(n);
            }
        }
    }

    @Override
    @Transactional
    public void createNotification(User user, String title, String message, NotificationType type) {
        if (user == null) {
            log.warn("Cannot create notification for null user");
            return;
        }

        Notification notification = Notification.builder()
                .user(user)
                .title(title)
                .message(message)
                .type(type)
                .readStatus(false)
                .build();

        notificationRepository.save(notification);
        log.info("Created {} notification for user {}: {}", type, user.getEmail(), title);
    }

    private NotificationResponseDto mapToDto(Notification notification) {
        return NotificationResponseDto.builder()
                .id(notification.getId())
                .userId(notification.getUser().getId())
                .title(notification.getTitle())
                .message(notification.getMessage())
                .type(notification.getType())
                .readStatus(notification.getReadStatus())
                .createdAt(notification.getCreatedAt())
                .build();
    }
}
