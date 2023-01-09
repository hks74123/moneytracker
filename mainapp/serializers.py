from rest_framework.serializers import ModelSerializer
from mainapp.models import *

class UserSerializer(ModelSerializer):
    class Meta:
        model = User
        fields = ['first_name','last_name','username']

class TransactionSerializer(ModelSerializer):
    users = UserSerializer(read_only=True,many=True)
    payed_by = UserSerializer(read_only=True)
    class Meta:
        model = transaction
        fields = ['id','users','payed_by','amount','date','spending_category']

class DuesSerializer(ModelSerializer):
    user = UserSerializer(read_only=True)
    class Meta:
        model = dues
        fields = ['user','amount']

class AccountSerializer(ModelSerializer):
    user = UserSerializer(read_only=True)
    class Meta:
        model = accounts
        fields = ['user','budget','spend']

class FriendSerializer(ModelSerializer):
    friends = UserSerializer(read_only=True,many=True)
    class Meta:
        model = friends
        fields = ['friends']


