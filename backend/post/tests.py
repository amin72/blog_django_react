import os
from time import sleep
from django.test import TestCase
from django.contrib.auth import get_user_model
from django.urls import reverse
from django.core.files.uploadedfile import SimpleUploadedFile
from django.test.client import encode_multipart

from rest_framework import status

from .models import Post
from .serializers import PostSerializer
from .api import PostViewSet


User = get_user_model()



def create_image():
    """Create image object for post by given image path"""

    image_path = 'static/img/test_image.png'

    image = SimpleUploadedFile(name='test_image.png',
        content=open(image_path, 'rb').read(),
        content_type='image/png')

    return image



def remove_file(path):
    """Remove a file if exists"""
    
    try:
        if os.path.exists(path):
            os.remove(path)
    except Exception as ex:
        print(ex)



class PostModelTestCase(TestCase):
    def setUp(self):
        self.user_info = {
            'username': 'admin',
            'password': 'admin123456'
        }

        self.user = User.objects.create_user(email="admin@example.com",
            **self.user_info)

        # create two post in publish mode
        Post.objects.create(author=self.user,
            title='Post test 1',
            content='Post content',
            image=create_image(),
            status=Post.STATUS_PUBLISH)
        
        Post.objects.create(author=self.user,
            title='Post test 2',
            content='Post content',
            image=create_image(),
            status=Post.STATUS_PUBLISH)

        # and one with draft status
        Post.objects.create(author=self.user,
            title='Post test 3',
            content='Post content',
            image=create_image(),
            status=Post.STATUS_DRAFT)


    def test_create_post(self):
        """
        Test creating posts.
        Since creating post is done via post method, we must test throttling.
        """

        posts = [
            {
                'author': self.user,
                'title': 'Post 1',
                'content': 'Post Content 1',
                'image': create_image(),
                'tags': []
            },
            {
                'author': self.user,
                'title': 'Post 2',
                'content': 'Post Content 2',
                'image': create_image(),
                'tags': []
            },
            {
                'author': self.user,
                'title': 'Post 3',
                'content': 'Post Content 3',
                'image': create_image(),
                'tags': []
            },
            {
                'author': self.user,
                'title': 'Post 4',
                'content': 'Post Content 4',
                'image': create_image(),
                'tags': []
            },
            {
                'author': self.user,
                'title': 'Post 5',
                'content': 'Post Content 5',
                'image': create_image(),
                'tags': []
            },
            {
                'author': self.user,
                'title': 'Post 6',
                'content': 'Post Content 6',
                'image': create_image(),
                'tags': []
            },            
            {
                'author': self.user,
                'title': 'Post 7',
                'content': 'Post Content 7',
                'image': create_image(),
                'tags': []
            },            
            {
                'author': self.user,
                'title': 'Post 1',
                'content': 'Post Content 1',
                'image': create_image(),
                'tags': []
            },
            {
                'author': self.user,
                'title': 'Post 2',
                'content': 'Post Content 2',
                'image': create_image(),
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
        response = self.create_post(posts[3], 0)
        # check response status
        self.assertEqual(response.status_code,
            status.HTTP_429_TOO_MANY_REQUESTS)
        
        # try to create post after one minute (throttling)
        print('Waiting for one minute...')
        sleep(60)
        print('Trying to create one more post...')
        response = self.create_post(posts[4], 1)
        # check response status
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)


    def test_update_post(self):
        """
        Test updating posts.
        Updating post is done via put/patch methods, we must test throttling.
        """

        post = Post.objects.filter(status=Post.STATUS_PUBLISH).first()
        post_new_data = {
            'author': post.author,
            'title': 'Post (Edited)',
            'content': 'Content (Edited)',
            'image': create_image(),
            'tags': []
        }
 
        # remove post's image
        remove_file(post.image.path)

        response = self.update_post(post.slug, post_new_data)
        result = response.json()

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        
        # check updated fields (title, content)
        self.assertEqual(result['title'], post_new_data['title'])
        self.assertEqual(result['content'], post_new_data['content'])
        
        # let's check throttling
        post = Post.objects.filter(status=Post.STATUS_PUBLISH).first()
        post_new_data['image'] = create_image() 

        response = self.update_post(post.slug, post_new_data, 0)
        self.assertEqual(response.status_code,
            status.HTTP_429_TOO_MANY_REQUESTS)
    

    def test_delete_post(self):
        """Test deleting post."""

        post = Post.objects.filter(status=Post.STATUS_PUBLISH).first()
        url = reverse('post:post-detail', kwargs={'slug': post.slug})

        sleep(1) # to pass throtteling
        # login
        self.client.login(**self.user_info)
        # delete post
        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        remove_file(post.image.path)


    def test_get_posts(self):
        """Test getting all published posts"""

        url = reverse('post:post-list')
        response = self.client.get(url)
        result = response.json()
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(result['count'], 2) # two posts in publish status


    def test_detail_post(self):
        """Test getting single post"""

        posts = Post.objects.all()
        published_post = posts.filter(status=Post.STATUS_PUBLISH).first()
        draft_post = posts.filter(status=Post.STATUS_DRAFT).first()

        # get published post (200)
        url = reverse('post:post-detail', kwargs={'slug': published_post.slug})
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        
        # get draft post (404)
        url = reverse('post:post-detail', kwargs={'slug': draft_post.slug})
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)


    def tearDown(self):
        # remove all posts image files
        posts = Post.objects.all()
        for post in posts:
            remove_file(post.image.path)


    def create_post(self, post, time_to_sleep=1):
        """Helper method to create post"""

        # sleep for `time_to_sleep` seconds to pass throttling
        sleep(time_to_sleep)
        # url api
        url = reverse('post:post-list')
        # login
        self.client.login(**self.user_info)
        # send posts data
        return self.client.post(url, post)


    def update_post(self, post_slug, new_data, time_to_sleep=1):
        """Helper method to update post"""

        # sleep for `time_to_sleep` seconds to pass throttling
        sleep(time_to_sleep)
        # url api
        url = reverse('post:post-detail', kwargs={'slug': post_slug})
        # login
        self.client.login(**self.user_info)
        # send posts data

        content = encode_multipart('BoUnDaRyStRiNg', new_data)
        content_type = 'multipart/form-data; boundary=BoUnDaRyStRiNg'
        
        # update post via put/patch method
        return self.client.put(url, content, content_type=content_type)
