from django.contrib import admin
from mainapp.models import friends,accounts,dues,transaction,friend_request
# Register your models here.
admin.site.register(friends)
admin.site.register(accounts)
admin.site.register(dues)
admin.site.register(transaction)
admin.site.register(friend_request)