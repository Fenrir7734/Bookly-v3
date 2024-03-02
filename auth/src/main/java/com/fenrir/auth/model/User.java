package com.fenrir.auth.model;

import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;

import javax.persistence.Column;
import javax.persistence.Embedded;
import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Size;
import java.time.LocalDateTime;

@NoArgsConstructor
@Getter
@Setter
@Entity
@Table(name = "user")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    @Size(min = 2, max = 50)
    @Column(name = "firstname", nullable = false)
    private String firstname;

    @NotBlank
    @Size(min = 2, max = 50)
    @Column(name = "lastname", nullable = false)
    private String lastname;

    public User(Long id, String firstname, String lastname) {
        this.id = id;
        this.firstname = firstname;
        this.lastname = lastname;
    }

    public String getFullName() {
        return firstname + " " + lastname;
    }

    @Embedded
    private Credentials credentials;

    @Embedded
    private Contact contact;

    @Column(name = "verified", nullable = false)
    private Boolean verified;

    @Column(name = "banned", nullable = false)
    private Boolean banned;

    @Setter(AccessLevel.NONE)
    @CreationTimestamp
    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Enumerated(value = EnumType.STRING)
    private Role role;

    public User(
            Long id,
            String firstname,
            String lastname,
            Credentials credentials,
            Contact contact,
            Role role) {

        this(id, firstname, lastname);
        this.credentials = credentials;
        this.contact = contact;
        this.role = role;
    }

    public User(
            String firstname,
            String lastname,
            Credentials credentials,
            Contact contact,
            boolean verified,
            boolean banned) {

        this(null, firstname, lastname);
        this.credentials = credentials;
        this.contact = contact;
        this.role = Role.ROLE_USER;
        this.verified = verified;
        this.banned = banned;
    }
}
