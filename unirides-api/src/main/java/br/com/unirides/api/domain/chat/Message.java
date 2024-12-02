package br.com.unirides.api.domain.chat;
import lombok.*;

import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class Message {

    private String senderName;
    private String receiverName;
    private String message;
    private String date;
    private Status status;
}
