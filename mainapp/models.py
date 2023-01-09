from django.db import models
from django.contrib.auth.models import User

# Create your models here.
class friends(models.Model):
    user = models.ForeignKey(User,related_name='user1',on_delete=models.Case)
    friends = models.ManyToManyField(User)

class accounts(models.Model):
    user = models.ForeignKey(User,on_delete=models.Case)
    budget = models.FloatField(default=5000)
    spend = models.FloatField()


class transaction(models.Model):
    users = models.ManyToManyField(User)
    payed_by = models.ForeignKey(User,related_name='payed_by',on_delete=models.Case,null=True)
    amount = models.FloatField(default=0)
    date = models.DateTimeField()
    spending_category = models.CharField(max_length=15)

class dues(models.Model):
    user = models.ForeignKey(User,on_delete=models.Case)
    transactions = models.ForeignKey(transaction,on_delete=models.CASCADE,null=True)
    duer = models.ForeignKey(User,related_name='duer',on_delete=models.Case)
    amount = models.FloatField()
    due = models.BooleanField(default=False)

class friend_request(models.Model):
    from_user=models.ForeignKey(User,related_name='from_user',on_delete=models.CASCADE,unique=False)
    to_user=models.ForeignKey(User,related_name='to_user',on_delete=models.CASCADE)
