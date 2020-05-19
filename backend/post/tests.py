import time
from django.test import TestCase
from django.urls import reverse
from post.models import Post
from account.models import User

from django.core.files.uploadedfile import SimpleUploadedFile



class PostModelTestCase(TestCase):
    def setUp(self):
        image_path = '/home/amin/Pictures/star.jpg'
        image = SimpleUploadedFile(name='start_image.jpg',
            content=open(image_path, 'rb').read(),
            content_type='image/jpeg')


        user0 = User.objects.create_user(username="testuser0",
            password="test123456",
            email="testuser0@example.com")
        
        # create six posts
        # 3 of thme have published status and 1 draft
        
        # published post
        Post.objects.create(author=user0,
            title='Post 1',
            content='Post Content 1',
            image=image,
            status=Post.STATUS_PUBLISH)
        
        # published post
        Post.objects.create(author=user0,
            title='Post 2',
            content='Post Content 2',
            image=image,
            status=Post.STATUS_PUBLISH)
        time.sleep(1)

        # draft post
        Post.objects.create(author=user0,
            title='Post 2',
            content='Post Content 2',
            image=image,
            status=Post.STATUS_DRAFT)
        time.sleep(1)

        # draft post
        Post.objects.create(author=user0,
            title='Post 2',
            content='Post Content 2',
            image=image,
            status=Post.STATUS_DRAFT)

        # draft post
        Post.objects.create(author=user0,
            title='Post 3',
            content='Post Content 3',
            image=image,
            status=Post.STATUS_DRAFT)

        # published post
        Post.objects.create(author=user0,
            title='Post 4',
            content='Post Content 4',
            image=image,
            status=Post.STATUS_PUBLISH)
    

    def test_post_list(self):
        response = self.client.get(reverse('post:post-list'))
        self.assertEqual(response.status_code, 200)
        data = response.json()
        
        # we must get three posts (three posts which thier status is Published)
        self.assertEqual(data['count'], 3)
        self.assertEqual(len(data['results']), 3)
