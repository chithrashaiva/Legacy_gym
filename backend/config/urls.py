"""
URL configuration for config project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/6.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
import os
from django.contrib import admin
from django.urls import path, include, re_path
from django.http import JsonResponse, FileResponse
from django.conf import settings

def api_status_view(request):
    return JsonResponse({
        "status": "online",
        "message": "Legacy Gym Backend API",
        "endpoints": {
            "admin": "/admin/",
            "auth_register": "/api/auth/register/",
            "auth_login": "/api/auth/login/",
            "auth_refresh": "/api/auth/refresh/",
            "auth_me": "/api/auth/me/"
        }
    })

def spa_fallback_view(request):
    index_path = settings.BASE_DIR.parent / 'frontend' / 'dist' / 'index.html'
    if os.path.exists(index_path):
        return FileResponse(open(index_path, 'rb'))
    return api_status_view(request)

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/status/', api_status_view, name='api_status'),
    path('api/auth/', include('accounts.urls')),
    re_path(r'^(?:(?!api|admin).)*$', spa_fallback_view, name='spa_index'),
]

