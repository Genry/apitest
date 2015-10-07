#coding: utf-8
from core.views import main_page_view, send_request_view
from django.conf.urls import patterns, url

urlpatterns = patterns('',
    # Examples:
    url(r'^$', main_page_view, name='main_page'),
    url(r'^send_request$', send_request_view, name='send_request'),
)