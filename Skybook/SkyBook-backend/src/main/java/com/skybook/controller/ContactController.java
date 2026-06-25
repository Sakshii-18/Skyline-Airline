package com.skybook.controller;

import com.skybook.model.ContactMessage;
import com.skybook.service.ContactService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/contact")
@CrossOrigin(origins = "*")
public class ContactController {

    private final ContactService contactService;

    public ContactController(ContactService contactService) {
        this.contactService = contactService;
    }

    // POST /api/contact -> save a contact form submission
    @PostMapping
    public ResponseEntity<ContactMessage> sendMessage(@Valid @RequestBody ContactMessage message) {
        ContactMessage saved = contactService.saveMessage(message);
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }
}
