from django.db import models
from django.core.exceptions import ValidationError
from django.contrib.auth.models import AbstractUser
from django.utils.translation import ugettext_lazy as _

from django.contrib.auth.password_validation import MinimumLengthValidator


def field_length_validator(field, field_name, min_length, max_length):
    """Check wether given password is greater or equal length or not"""

    if field:
        length = len(field)

        if min_length > 0 and length < min_length:
            raise ValidationError(
                _(f'Ensure {field_name} has at least {min_length} characters.'))
        
        if length > max_length:
            raise ValidationError(
                _(f'Ensure {field_name} has no more than {max_length} characters.'))



class User(AbstractUser):
    MIN_PASSWORD_LENGTH = 8
    MAX_PASSWORD_LENGTH = 128

    MIN_USERNAME_LENGTH = 0 # minimum length is not checked
    MAX_USERNAME_LENGTH = 40

    MIN_EMAIL_LENGTH = 0 # minimum length is not checked
    MAX_EMAIL_LENGTH = 100
    
    username = models.CharField(_('Username'),
        max_length=MAX_USERNAME_LENGTH,
        unique=True,
        db_index=True)

    email = models.EmailField(_('Email'),
        max_length=MAX_EMAIL_LENGTH,
        unique=True,
        db_index=True)

    password = models.CharField(_('Password'), max_length=128)


    def save(self, *args, **kwargs):
        # validate username, password and email length validation
        field_length_validator(self._password, 'Password',
            User.MIN_PASSWORD_LENGTH, User.MAX_PASSWORD_LENGTH)
        
        field_length_validator(self.username, 'Username',
            User.MIN_USERNAME_LENGTH, User.MAX_USERNAME_LENGTH)
        
        field_length_validator(self.email, 'Email',
            User.MIN_EMAIL_LENGTH, User.MAX_EMAIL_LENGTH)
        
        return super().save(*args, **kwargs)


    class Meta:
        verbose_name = _('User')
        verbose_name = _('Users')
        ordering = ['-date_joined']
