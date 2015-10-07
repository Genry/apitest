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
    data = params = headers = {}

    if request.POST.get('method') == 'GET':
        method = 'GET'
        if request.POST.get('params', []):
            params = dict((key, value) for key, value in [rec.split('.') for rec in request.POST.get('params').split(',')])
    else:
        method = 'POST'
        if request.POST.get('params', []):
            data = dict((key, value) for key, value in [rec.split('.') for rec in request.POST.get('params').split(',')])

    if request.POST.get('headers', []):
        headers = dict((key, value) for key, value in [rec.split('.') for rec in request.POST.get('headers').split(',')])

    url = request.POST.get('url', '')

    if not url:
        return Response()

    response = requests.request(method, build_url(url), headers=headers, data=data, params=params)
    return Response({
        'text': response.text,
        'status': response.status_code
    })
