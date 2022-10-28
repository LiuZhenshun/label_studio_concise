from django.utils.deprecation import MiddlewareMixin


class MyMiddleware(MiddlewareMixin):

    def process_request(self, request):
        'Accept-Ranges' in request.headers

    def process_response(self, request, response):
        #response = self.get_response
        #response.headers['Accept-Ranges'] = "bytes"
        response['Accept-Ranges'] = "bytes"
        #print('Accept-Ranges' in response.headers)
        return response
