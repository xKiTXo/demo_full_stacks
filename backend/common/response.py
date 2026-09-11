from rest_framework.response import Response
from rest_framework import status

def SuccessResponse(msg,data,status_code):
    final_data = {} if data is None else data
    final_message = "Success" if msg is None else msg
    final_status_code = status.HTTP_200_OK if status_code is None else status_code
    return Response({"success":True,"status_code":final_status_code,
                "message": final_message,"data": final_data},status=final_status_code)
    
def ErrorResponse(msg,status_code):
    final_message = "Failed!" if msg is None else msg
    final_status_code = status.HTTP_400_BAD_REQUEST if status_code is None else status_code
    return Response({"success":False,"status_code":final_status_code,
                "message": final_message,"data": None},status=final_status_code)