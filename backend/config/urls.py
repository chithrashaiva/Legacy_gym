import os
from django.contrib import admin
from django.urls import path, include, re_path
from django.http import JsonResponse, FileResponse
from django.conf import settings
from django.conf.urls.static import static

def api_status_view(request):
    return JsonResponse({
        "status": "online",
        "message": "Legacy Gym Backend API",
        "endpoints": {
            "admin": "/admin/",
            "auth_register": "/api/auth/register/",
            "auth_login": "/api/auth/login/",
            "portal_summary": "/api/portal/member-summary/",
            "send_otp": "/api/portal/send-otp/"
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
    path('api/', include('accounts.urls')),
    re_path(r'^(?:(?!api|admin).)*$', spa_fallback_view, name='spa_index'),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
