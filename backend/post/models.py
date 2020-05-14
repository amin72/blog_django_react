from django.db import models
from django.utils.translation import ugettext_lazy as _
from django.contrib.auth import get_user_model
from django.utils.text import slugify


User = get_user_model()


class Tag(models.Model):
    """This model holds tags used in the blog"""

    # name holds tag's name
    # slug holds the slugified tag's name
    # name ==> "Test Title"
    # slug ==> "test-title"

    name = models.CharField(max_length=128, unique=True, db_index=True)
    slug = models.SlugField(max_length=128,
        unique=True,
        db_index=True,
        blank=True,
        allow_unicode=True)
        
    def save(self,*args,**kwargs):
        # slugify name
        self.slug = slugify(self.name, True)
        return super().save(*args,**kwargs)
    
    def __str__(self):
        return self.name
    
    class Meta:
        verbose_name = _('Tag')
        verbose_name_plural = _('Tags')



class Post(models.Model):
    """Post model holds blog's articles information"""

    # each post has two status (either in draft mode or published)
    STATUS_DRAFT = 1
    STATUS_PUBLISH = 2
    
    STATUS_CHOICES = (
        (STATUS_DRAFT, _('Draft')),
        (STATUS_PUBLISH, _('Publish')),
    )


    author = models.ForeignKey(User,
        on_delete=models.DO_NOTHING,
        related_name='posts')

    title = models.CharField(_("Title"), max_length=250, db_index=True)
    content = models.TextField(_("Content"))
    slug = models.SlugField(_("Slug"),
        max_length=250,
        db_index=True,
        blank=True,
        allow_unicode=True)
    
    created = models.DateTimeField(_("Created"), auto_now_add=True)
    updated = models.DateTimeField(_("Updated"), auto_now=True)

    total_likes = models.PositiveIntegerField(_("Total likes"), default=0)
    total_comments = models.PositiveIntegerField(_("Total comments"),
        default=0)
    
    status = models.SmallIntegerField(choices=STATUS_CHOICES,
        default=STATUS_DRAFT)
    tags = models.ManyToManyField(Tag, verbose_name=_("Tag"), blank=True)

    def save(self,*args,**kwargs):
        # slugify title
        self.slug = slugify(self.title, True)
        return super().save(*args,**kwargs)

    def __str__(self):
        return self.title
    
    class Meta:
        verbose_name = _('Post')
        verbose_name_plural = _('Posts')
