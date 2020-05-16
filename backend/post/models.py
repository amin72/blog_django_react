from django.db import models, IntegrityError
from django.utils import timezone
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
        unique=True,
        max_length=250,
        db_index=True,
        blank=True,
        allow_unicode=True)

    # set height and width for image field
    image_height = models.PositiveIntegerField(_("Image Height"), default=400)
    image_width = models.PositiveIntegerField(_("Image Width"), default=400)

    image = models.ImageField(_("Image"),
        upload_to="post/images/",
        height_field='image_height',
        width_field='image_width')

    created = models.DateTimeField(_("Created"), auto_now_add=True)
    updated = models.DateTimeField(_("Updated"), auto_now=True)

    total_likes = models.PositiveIntegerField(_("Total likes"), default=0)
    total_comments = models.PositiveIntegerField(_("Total comments"),
        default=0)
    
    status = models.SmallIntegerField(choices=STATUS_CHOICES,
        default=STATUS_DRAFT)
    tags = models.ManyToManyField(Tag, verbose_name=_("Tag"), blank=True)

    def save(self, *args, **kwargs):
        now = timezone.now()

        slug = f'{now.year}-{now.month}-{now.day}-'
        slug += f'{now.hour}-{now.minute}-{now.second}-'

        # now slugify created time and title
        try:
            self.slug = slug + slugify(self.title)
        except IntegrityError:
            slug += f'{now.microsecond}-'
            self.slug = slug + slugify(self.title)

        return super().save(*args, **kwargs)

    def __str__(self):
        return self.title
    
    class Meta:
        verbose_name = _('Post')
        verbose_name_plural = _('Posts')
        ordering = ['-id']
