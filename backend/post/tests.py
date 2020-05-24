from time import sleep
from django.test import TestCase
from django.urls import reverse, resolve
from django.core.files.uploadedfile import SimpleUploadedFile
from rest_framework import status
from .models import Post
from .serializers import PostSerializer
from .api import PostViewSet
from account.models import User
from rest_framework.test import APIRequestFactory, force_authenticate


def create_image():
    image_path = '/home/amin/Pictures/star.jpg'

    image = SimpleUploadedFile(name='star_image.jpg',
        content=open(image_path, 'rb').read(),
        content_type='image/jpeg')

    return image



class PostModelTestCase(TestCase):
    def setUp(self):
        self.user_info = {
            'username': 'admin',
            'password': 'admin123456'
        }

        self.factory = APIRequestFactory()
        self.view = PostViewSet.as_view({'get': 'retrieve'})

        self.user = User.objects.create_user(email="admin@example.com",
            **self.user_info)


    def test_create_post(self):
        posts = [
            {
                'author': self.user,
                'title': 'Post 1',
                'content': 'Post Content 1',
                'image': create_image(),
                'status': Post.STATUS_PUBLISH,
                'tags': []
            },
            {
                'author': self.user,
                'title': 'Post 2',
                'content': 'Post Content 2',
                'image': create_image(),
                'status': Post.STATUS_PUBLISH,
                'tags': []
            },
            {
                'author': self.user,
                'title': 'Post 3',
                'content': 'Post Content 3',
                'image': create_image(),
                'status': Post.STATUS_DRAFT,
                'tags': []
            },
            {
                'author': self.user,
                'title': 'Post 4',
                'content': 'Post Content 4',
                'image': create_image(),
                'status': Post.STATUS_PUBLISH,
                'tags': []
            },
            {
                'author': self.user,
                'title': 'Post 5',
                'content': 'Post Content 5',
                'image': create_image(),
                'status': Post.STATUS_DRAFT,
                'tags': []
            },
            {
                'author': self.user,
                'title': 'Post 6',
                'content': 'Post Content 6',
                'image': create_image(),
                'status': Post.STATUS_PUBLISH,
                'tags': []
            },            
            {
                'author': self.user,
                'title': 'Post 7',
                'content': 'Post Content 7',
                'image': create_image(),
                'status': Post.STATUS_PUBLISH,
                'tags': []
            },            
            {
                'author': self.user,
                'title': 'Post 1',
                'content': 'Post Content 1',
                'image': create_image(),
                'status': Post.STATUS_DRAFT,
                'tags': []
            },
            {
                'author': self.user,
                'title': 'Post 2',
                'content': 'Post Content 2',
                'image': create_image(),
                'status': Post.STATUS_PUBLISH,
                'tags': []
            }
        ]

        # we can create 2 posts in one minute
        # also one post per second
        for post in posts[:2]:
            # setting time_to_sleep to 1 will be ok
            response = self.create_post(post, 1)
            # check response status
            self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        
        # we cannot create more than 2 posts in one minute
        # so here we get 429 (too many request) response
        # setting time_to_sleep to 0 will raise throttling exception
        response = self.create_post(posts[2], 0)
        # check response status
        self.assertEqual(response.status_code,
            status.HTTP_429_TOO_MANY_REQUESTS)
        
        print('Waiting for one minute...')
        sleep(60)
        print('Trying to create one more post...')
        response = self.create_post(posts[3], 1)
        # check response status
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)


    def create_post(self, post, time_to_sleep=1):
        # sleep for `time_to_sleep` seconds to pass throttling
        sleep(time_to_sleep)
        # url api
        url = reverse('post:post-list')
        # login
        self.client.login(**self.user_info)
        # send posts data
        response = self.client.post(url, post)
        return response
        
