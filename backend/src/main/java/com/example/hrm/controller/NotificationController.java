package com.example.hrm.controller;

import com.example.hrm.dto.common.ApiResponse;
import com.example.hrm.dto.notification.NotificationResponseDto;
import com.example.hrm.security.UserPrincipal;
import com.example.hrm.service.NotificationService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/notifications")
@RequiredArgsConstructor
@Tag(name = "In-App Notifications", description = "APIs for user notifications and unread badges")
public class NotificationController {

    private final NotificationService notificationService;

    @GetMapping
    @Operation(summary = "Get User Notifications", description = "Fetches complete list of in-app notifications for authenticated user")
    public ResponseEntity<ApiResponse<List<NotificationResponseDto>>> getNotifications(
            @AuthenticationPrincipal UserPrincipal principal) {
        return ResponseEntity.ok(ApiResponse.success(
                "Notifications fetched successfully",
                notificationService.getUserNotifications(principal.getId())
        ));
    }

    @GetMapping("/unread-count")
    @Operation(summary = "Get Unread Notification Count", description = "Returns total count of unread notifications for badge rendering")
    public ResponseEntity<ApiResponse<Long>> getUnreadCount(
            @AuthenticationPrincipal UserPrincipal principal) {
        return ResponseEntity.ok(ApiResponse.success(
                "Unread count fetched",
                notificationService.getUnreadCount(principal.getId())
        ));
    }

    @PutMapping("/{id}/read")
    @Operation(summary = "Mark Notification as Read", description = "Marks a specific notification as read")
    public ResponseEntity<ApiResponse<NotificationResponseDto>> markAsRead(
            @PathVariable Long id,
            @AuthenticationPrincipal UserPrincipal principal) {
        return ResponseEntity.ok(ApiResponse.success(
                "Notification marked as read",
                notificationService.markAsRead(id, principal.getId())
        ));
    }

    @PutMapping("/read-all")
    @Operation(summary = "Mark All Notifications as Read", description = "Marks all notifications for authenticated user as read")
    public ResponseEntity<ApiResponse<Void>> markAllAsRead(
            @AuthenticationPrincipal UserPrincipal principal) {
        notificationService.markAllAsRead(principal.getId());
        return ResponseEntity.ok(ApiResponse.success("All notifications marked as read", null));
    }
}
