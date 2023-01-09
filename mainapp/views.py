from django.shortcuts import render,redirect
from rest_framework.views import APIView
from .repositry import usermanager,MoneyTrackerHandler
from rest_framework.response import Response
from django.contrib.auth import logout
# Create your views here.

def mainpage(request):
    if not request.user.is_authenticated:
        return render(request,'home.html')
    return render(request,'accounts.html')

def signup(request):
    if not request.user.is_authenticated:
        return render(request,'register.html')
    return redirect('/')

def login(request):
    if not request.user.is_authenticated:
        return render(request,'login.html')
    return redirect('/')

def handlertrans(request):
    if request.user.is_authenticated:
        return render(request,'transactions.html')
    return redirect('/')

def handlerfiends(request):
    if request.user.is_authenticated:
        return render(request,'friends.html')
    return redirect('/')

class register(APIView):
    def post(self,request):
        if not request.user.is_authenticated:
            return usermanager().user_registration(request)
        return Response({'status':200,'message':'Alreay authenticated.'})

class loginuser(APIView):
    def post(self,request):
        if not request.user.is_authenticated:
            return usermanager().user_login(request)
        return Response({'status':200,'message':'Alreay authenticated.'})

class accoundetails(APIView):
    def get(self,request):
        if request.user.is_authenticated:
            return MoneyTrackerHandler().get_account_details(request)
        return Response({'status':200,'message':'User not authenticated'})
    
    def patch(self,request):
        if request.user.is_authenticated:
            return MoneyTrackerHandler().update_account_details(request)
        return Response({'status':200,'message':'User not authenticated'})


class usersapi(APIView):
    def get(self,request):
        if request.user.is_authenticated:
            return MoneyTrackerHandler().gettrackerusers(request)
        return Response({'status':200,'message':'User not authenticated'})

class friendsapi(APIView):
    def get(self,request):
        if request.user.is_authenticated:
            return MoneyTrackerHandler().getusersfriends(request)
        return Response({'status':200,'message':'User not authenticated'})

class friendsdetailedapi(APIView):
    def get(self,request):
        if request.user.is_authenticated:
            return MoneyTrackerHandler().getuserfriends(request)
        return Response({'status':200,'message':'User not authenticated'})

class transactionapi(APIView):
    def get(self,request):
        if request.user.is_authenticated:
            return MoneyTrackerHandler().gettransaction(request)
        return Response({'status':200,'message':'User not authenticated'})

    def post(self,request):
        if request.user.is_authenticated:
            return MoneyTrackerHandler().createtransaction(request)
        return Response({'status':200,'message':'User not authenticated'})
    
    def patch(self,request):
        if request.user.is_authenticated:
            return MoneyTrackerHandler().updatetransaction(request)
        return Response({'status':200,'message':'User not authenticated'})

    def delete(self,request):
        if request.user.is_authenticated:
            return MoneyTrackerHandler().deletetransaction(request)
        return Response({'status':200,'message':'User not authenticated'})

class logoutuser(APIView):
    def get(self,request):
        if request.user.is_authenticated:
            logout(request)
            return redirect('/')

class add_friends(APIView):
    def post(self,request):
        if request.user.is_authenticated:
            return MoneyTrackerHandler().add_firend(request)
        return Response({'status':200,'message':'User not authenticated'})

class get_friend_request(APIView):
    def get(self,request):
        if request.user.is_authenticated:
            return MoneyTrackerHandler().get_friend_req(request)
        return Response({'status':200,'message':'User not authenticated'})

class addfriend(APIView):
    def post(self,request):
        if request.user.is_authenticated:
            return MoneyTrackerHandler().addfriend(request)
        return Response({'status':200,'message':'User not authenticated'})

class remfriend(APIView):
    def post(self,request):
        if request.user.is_authenticated:
            return MoneyTrackerHandler().remfriend(request)
        return Response({'status':200,'message':'User not authenticated'})





        

    

        

