from rest_framework.throttling import UserRateThrottle


class PostSecThrottle(UserRateThrottle):
    scope = 'post_sec'
     


class PostMinThrottle(UserRateThrottle):
    scope = 'post_min'



class PostHourThrottle(UserRateThrottle):
    scope = 'post_hour'



class PostDayThrottle(UserRateThrottle):
    scope = 'post_day'
