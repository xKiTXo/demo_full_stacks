from rest_framework import pagination,status
from common.response import SuccessResponse

class CustomPagination(pagination.PageNumberPagination):
    page_size=10
    page_size_query_param="page_size"
    page_query_param="page"
    
    def get_previous_link(self):
        url = super().get_previous_link()
        if url is not None:
            return url.replace('http://192.168.65.128:8000/api/', 'http://localhost:3000/')
        return None
    
    def get_next_link(self):
        url = super().get_next_link()
        if url is not None:
            return url.replace('http://192.168.65.128:8000/api/', 'http://localhost:3000/')
        return None
    
    def get_paginated_response(self, data):
        return SuccessResponse(msg="",data={
            'links': {
                'next': self.get_next_link(),
                'previous': self.get_previous_link()
            },
            'page_count':self.page.paginator.num_pages,
            'count': self.page.paginator.count,
            'results': data
        },status_code=status.HTTP_200_OK)

