from rest_framework.throttling import UserRateThrottle


class PostSecUserRateThrottle(UserRateThrottle):
    """Implement throttlling to allow requests per second
    for methods other than get method.
    """

    rate = '1/sec'

    def allow_request(self, request, view):
        if request.method == "GET":
            return True
        return super().allow_request(request, view)



class PostMinUserRateThrottle(UserRateThrottle):
    """
    Implement throttlling to allow requests per minute
    for methods other than get method.
    """
    
    rate = '2/min'

    def allow_request(self, request, view):
        if request.method == "GET":
            return True
        return super().allow_request(request, view)



class PostHourUserRateThrottle(UserRateThrottle):
    """
    Implement throttlling to allow requests per hour
    for methods other than get method.
    """
    
    rate = '4/hour'

    def allow_request(self, request, view):
        if request.method == "GET":
            return True
        return super().allow_request(request, view)



class PostDayUserRateThrottle(UserRateThrottle):
    """
    Implement throttlling to allow requests per day
    for methods other than get method.
    """

    rate = '10/day'

    def allow_request(self, request, view):
        if request.method == "GET":
            return True
        return super().allow_request(request, view)
