package com.example.hrm.dto.notification;

import com.example.hrm.enums.NotificationType;
import lombok.*;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class NotificationResponseDto {
    private Long id;
    private Long userId;
    private String title;
    private String message;
    private NotificationType type;
    private Boolean readStatus;
    private LocalDateTime createdAt;
}
