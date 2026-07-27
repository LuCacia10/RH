package mg.gouv.sgrh.service;

import org.junit.jupiter.api.Test;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.web.server.ResponseStatusException;

import java.util.regex.Matcher;
import java.util.regex.Pattern;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

class EmailOtpServiceTest {
    @Test
    void codeIsSentMaskedAndCanOnlyBeUsedOnce() {
        JavaMailSender sender = mock(JavaMailSender.class);
        EmailOtpService service = new EmailOtpService(sender, 300, "no-reply@sgrh.gov.mg");
        var sent = new SimpleMailMessage[1];
        doAnswer(invocation -> {
            sent[0] = invocation.getArgument(0);
            return null;
        }).when(sender).send(any(SimpleMailMessage.class));

        var challenge = service.create("agent", "agent@example.mg");

        assertEquals("a***@example.mg", challenge.getEmailMasked());
        assertEquals("agent@example.mg", sent[0].getTo()[0]);
        Matcher matcher = Pattern.compile("\\b\\d{6}\\b").matcher(sent[0].getText());
        assertTrue(matcher.find());
        assertEquals("agent", service.verify(challenge.getChallengeId(), matcher.group()));
        assertThrows(ResponseStatusException.class,
            () -> service.verify(challenge.getChallengeId(), matcher.group()));
    }

    @Test
    void challengeIsRevokedAfterFiveWrongCodes() {
        JavaMailSender sender = mock(JavaMailSender.class);
        EmailOtpService service = new EmailOtpService(sender, 300, "no-reply@sgrh.gov.mg");
        var sent = new SimpleMailMessage[1];
        doAnswer(invocation -> {
            sent[0] = invocation.getArgument(0);
            return null;
        }).when(sender).send(any(SimpleMailMessage.class));
        var challenge = service.create("agent", "agent@example.mg");
        Matcher matcher = Pattern.compile("\\b\\d{6}\\b").matcher(sent[0].getText());
        assertTrue(matcher.find());
        String actualCode = matcher.group();
        String wrongCode = actualCode.equals("999999") ? "000000" : "999999";

        for (int attempt = 0; attempt < 5; attempt++) {
            assertThrows(ResponseStatusException.class,
                () -> service.verify(challenge.getChallengeId(), wrongCode));
        }
        assertThrows(ResponseStatusException.class,
            () -> service.verify(challenge.getChallengeId(), actualCode));
        verify(sender, times(1)).send(any(SimpleMailMessage.class));
    }
}
