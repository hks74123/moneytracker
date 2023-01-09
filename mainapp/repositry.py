from rest_framework.response import Response
from django.contrib.auth.models import User,auth
import json
from mainapp.models import accounts,friends,transaction,dues,friend_request
from mainapp.serializers import AccountSerializer,UserSerializer,FriendSerializer,TransactionSerializer
import datetime


class usermanager:
    def user_registration(self,request):
        if request.method=='POST':
            data = json.loads(request.body)
            first_name = data.get('first_name')
            last_name = data.get('last_name')
            username = data.get('username') 
            email = data.get('email')
            password = data.get('password')
            password_again = data.get('password_again')
            if(first_name=='' or username=='' or email=='' or password==''):
                return Response({'status':200,'message':'Please fill out all given fields!!'})
            if password!=password_again:
                return Response({'status':200,'message':'Passwords does not matched!!'})
            try:
                user = User.objects.get(email = email)
                return Response({'status':200,'message':'Email already exists!!'})
            except:
                if(User.objects.filter(username = username).exists()):
                    return Response({'status':200,'message':'Username already exists!!'})
                user = User.objects.create_user(first_name = first_name,last_name=last_name,username=username,email=email,password=password)
                user.save()
                account = accounts()
                account.user = user
                account.spend = 0.0
                account.save()
                friend = friends()
                friend.user = request.user
                friend.save()
                return Response({'status':200,'message':'success'})
    
    def user_login(self,request):
        if request.method=='POST':
            data = json.loads(request.body)
            username= data.get("username")
            password= data.get("pass")
            
            if(username=='' or password==''):
                return Response({'status':400,'message':'Please fill out all fields !!'})
            
            user=auth.authenticate(username=username,password=password)
            if user is None:
                return Response({'status':200,'message':'User does not exists'})
            auth.login(request,user)
            return Response({'status':200,'message':'success'})

class MoneyTrackerHandler:
    def get_account_details(self,request):
        account_details = accounts.objects.filter(user=request.user)
        serializer = AccountSerializer(account_details,many=True)
        return Response({'status':200,'message':'success','data':serializer.data})


    def update_account_details(self,request):
        data = request.data
        account = accounts.objects.get(user=request.user)
        account.budget = data.get('budget')
        account.spend = data.get('spend')
        account.save()
        return Response({'status':200,'message':'success'})

    def gettrackerusers(self,request):
        user_obj = User.objects.filter(is_staff=False)
        main_data = []
        friend = friends.objects.get(user=request.user)
        friend_reques = friend_request.objects.filter(to_user = request.user)
        for i in user_obj:
            data = {}
            if ((i not in friend.friends.all()) and i!=request.user) and i not in friend_reques:
                data['first_name'] = i.first_name
                data['last_name'] = i.last_name
                data['username'] = i.username
                main_data.append(data)
        return Response({'status':200,'message':'success','data':main_data})

    def getuserfriends(self,request):
        friend = friends.objects.get(user=request.user)
        main_data = []
        for i in friend.friends.all():
            data = {}
            data['friend_name'] = i.first_name+" " +i.last_name
            data['friend_username'] = i.username
            common = len(transaction.objects.filter(users=request.user).filter(users=i))
            data['common'] = common
            due = dues.objects.filter(user=request.user).filter(duer=i)
            total_due = 0
            for d in due:
                if(d.due):
                    total_due-=d.amount
                else:
                    total_due+=d.amount
            data['total_due'] = total_due
            main_data.append(data)

        return Response({'status':200,'message':'success','data':main_data})
    
    def getusersfriends(slef,request):
        friend = friends.objects.get(user=request.user)
        serializer = FriendSerializer(friend)
        return Response({'status':200,'message':'success','data':serializer.data})

    def gettransaction(self,request):
        transactions = transaction.objects.filter(users = request.user)
        serializer = TransactionSerializer(transactions,many=True)
        return Response({'status':200,'message':'success','data':serializer.data})

    def createtransaction(self,request):
        data  = request.data
        transactions = transaction()
        amount = data.get('amount')
        date = datetime.datetime.now()
        spending_category = data.get('spending_category')
        transactions.date = date
        transactions.spending_category = spending_category
        transactions.amount = amount
        transactions.save()
        users_list = data.get('users')
        users_list.append('('+request.user.username+')')
        pay = data.get('payed_by')
        due_amount = (int(amount)/len(users_list))
        
        if(pay==''):
            usa = request.user.username
        else:
            uss = pay.split('(')[1]
            usa = uss[:-1]
        for i in users_list:
            username = i.split('(')[1]
            usernam = username[:-1]
            user_obj = User.objects.get(username=usernam)
            transactions.users.add(user_obj)
            transactions.save()
            
            if(usa==user_obj.username):
                for us in users_list:
                    usern = us.split('(')[1]
                    use = usern[:-1]
                    if(use==user_obj.username):
                        continue
                    due = dues()
                    due.user = user_obj
                    due.duer = User.objects.get(username=use)
                    due.amount = due_amount
                    due.due = False
                    due.transactions = transactions
                    due.save()
                    acc = accounts.objects.get(user=user_obj)
                    acc.spend = due_amount
                    acc.save()

                acc = accounts.objects.get(user=request.user)
                acc.spend = due_amount
                acc.save()
            else:
                due = dues()
                due.user = user_obj
                due.duer = User.objects.get(username = usa)
                due.due=True
                due.amount = due_amount
                due.transactions = transactions
                due.save()
                acc = accounts.objects.get(user=request.user)
                acc.spend = due_amount
                acc.save()
        
        transactions.users.add(request.user)
        transactions.save()

        
        if(pay==''):
            transactions.payed_by = request.user
        else:
            u_nm = pay.split('(')[1]
            U_nmm = u_nm[:-1]
            transactions.payed_by = User.objects.get(username = U_nmm)
        transactions.save()
        

        return Response({'status':200,'message':'success'})

    def updatetransaction(self,request):
        data = request.data
        transactions = transaction.objects.get(id=data.get('id'))
        deu = dues.objects.filter(transactions = transactions)
        for d in deu:
            d.delete()
        amount = data.get('amount')
        spending_category = data.get('spending_category')
        transactions.spending_category = spending_category
        transactions.amount = amount
        transactions.save()
        users_list = data.get('users')
        pay = data.get('payed_by')
        due_amount = int(amount)/len(users_list)
        if(pay==''):
            pay = request.user
        for i in users_list:
            user_obj = User.objects.get(username=i)
            transactions.users.add(user_obj)
            transactions.save()
            if(pay==user_obj.username):
                for us in users_list:
                    if(us==user_obj.username):
                        continue
                    due = dues()
                    due.user = user_obj
                    due.duer = User.objects.get(username=us)
                    due.amount = due_amount
                    due.due = False
                    due.transactions = transactions
                    due.save()
            else:
                due = dues()
                due.user = user_obj
                due.duer = User.objects.get(username = pay)
                due.due=True
                due.amount = due_amount
                due.transactions = transactions
                due.save()


        if(pay==''):
            transactions.payed_by = request.user
        else:
            transactions.payed_by = User.objects.get(username = pay)
        transactions.save()
        return Response({'status':200,'message':'success'})

    def deletetransaction(self,request):
        data = request.data
        transactions = transaction.objects.get(id=data.get('id'))
        transactions.delete()
        return Response({'status':200,'message':'success'})

    def add_firend(self,request):
        data = request.data
        print(data)
        freind = friend_request()
        freind.from_user = request.user
        freind.to_user = User.objects.get(username=data.get('usersname'))
        freind.save()
        return Response({'status':200,'message':'success'})

    def get_friend_req(self,request):
        friend_requests = friend_request.objects.filter(to_user = request.user)
        main_data = []
        for i in friend_requests:
            data = {}
            data['id'] = i.id
            data['full_name'] = i.from_user.first_name+" "+ i.from_user.last_name
            data['username'] = i.from_user.username
            main_data.append(data)
        return Response({'status':200,'message':'success','data':main_data})

    def addfriend(self,request):
        data = request.data
        id = data.get('id')
        frnd = friend_request.objects.get(id = id)
        friend1 = friends.objects.get(user = frnd.from_user)
        friend1.friends.add(frnd.to_user)
        friend2 = friends.objects.get(user = frnd.to_user)
        friend2.friends.add(frnd.from_user)
        friend1.save()
        friend2.save()
        frnd.delete()
        return Response({'status':200,'message':'success'})

    def remfriend(self,request):
        data = request.data
        id = data.get('id')
        try:
            frnd = friend_request.objects.get(id = id)
            frnd.delete()
        except:
            pass
        return Response({'status':200,'message':'success'})


        





