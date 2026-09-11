from django.db import DatabaseError
from rest_framework.views import exception_handler
from rest_framework.response import Response
from rest_framework import status
from common.response import ErrorResponse

def custom_exception_handler(exc, content):
    print("into custom_exception_handler")
    
    response = exception_handler(exc, content)
    if response is None:
        if isinstance(exc,DatabaseError):
            response = ErrorResponse(
                msg=str(exc),
                status_code=status.HTTP_507_INSUFFICIENT_STORAGE,
            )
        else:
            response = ErrorResponse(
                msg=str(exc),
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )
    
    response=ErrorResponse(
        msg=response.data,
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
    )
    
    return response
    
    