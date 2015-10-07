#coding: utf-8
from django.conf import settings
from django.shortcuts import render
from django.views.decorators.csrf import csrf_exempt
import requests
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.test import APIRequestFactory


def build_url(postfix):
    return '%s/%s' % (settings.DOMAIN, postfix)


def main_page_view(request):
    return render(request, 'base.jade')


@csrf_exempt
@api_view(['POST'])
def send_request_view(request):
    """

    :param request:
    :return:
    """
    url = request.POST.get('url', '')
    if not url:
        return Response()
    response = requests.request(request.REQUEST.get('method'), build_url(url))
    return Response(response.text)
