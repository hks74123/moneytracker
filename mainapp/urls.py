from django.urls import path
from . import views

urlpatterns = [
    path('',views.mainpage),
    path('signup',views.signup),
    path('login',views.login),
    path('register',views.register.as_view()),
    path('loginuser',views.loginuser.as_view()),
    path('friends',views.handlerfiends),
    path('transactions',views.handlertrans),
    path('logout',views.logoutuser.as_view()),
    path('accounsdetailapi',views.accoundetails.as_view()),
    path('moneytrackerusersapi',views.usersapi.as_view()),
    path('friendsapi',views.friendsapi.as_view()),
    path('frienddetailedapi',views.friendsdetailedapi.as_view()),
    path('transactionsapi',views.transactionapi.as_view()),
    path('add_friends',views.add_friends.as_view()),
    path('get_friend_request',views.get_friend_request.as_view()),
    path('addfriend',views.addfriend.as_view()),
    path('remfriend',views.remfriend.as_view()),
]
