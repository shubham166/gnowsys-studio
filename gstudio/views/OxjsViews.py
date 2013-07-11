from gstudio.methods import *
from django.http import HttpResponse , Http404, HttpResponseRedirect 

import json
import datetime
import ox
from ox.django.api import actions
from ox.django.shortcuts import render_to_json_response, get_object_or_404_json, json_response

def Wikilist(request):
	pages = Systemtype.objects.get(title="Wikipage")
	page=pages.member_systems.all()
	list1=[]
	for each in page:
    		dict1={}
    		dict1['id'] = each.id
    		dict1['name'] = each.title
    		list1.append(dict1)
	#response = json_response(list1)
	#response = json_response({'errors': {'code': 'Incorrect code'}})
	return HttpResponse(json.dumps(list1))
	#return response#render_to_json_response(response)
#actions.register(Wikilist)

def LoomThread(request):
	threads = Systemtype.objects.get(title="Meeting")
	thread=threads.member_systems.all()
	list1=[]
	for each in thread:
    		dict1={}
    		dict1['id'] = each.id
    		dict1['name'] = each.title
    		list1.append(dict1)
	return HttpResponse(json.dumps(list1))


def Wikidetail1(request):
	pages = Systemtype.objects.get(title="Wikipage")
	page=pages.member_systems.all()
	list1=[]
	for each in page:
		if(each.id ==711):
	    		dict1={}
    			dict1['id'] = each.id
    			dict1['name'] = each.title
    			list1.append(dict1)
	return HttpResponse(json.dumps(list1))

def Wikidetail2(request):
	pages = Systemtype.objects.get(title="Wikipage")
	page=pages.member_systems.all()
	#try:
	#	offset = int(offset)
#	except ValueError:
#		raise Http404()
	list1 = []
	for each in page:
		if(each.id == offset):
			dict1 = {}
			dict1['id'] = each.id
			dict1['name'] = each.title
			#dict1['creation_date'] =(each.start_publication).isoformat()
			dict1['content'] = each.content
			list1.append(dict1)
	return HttpResponse(json.dumps(list1))

def Wikidetail(request, offset):
	pages = Systemtype.objects.get(title="Wikipage")
	page=pages.member_systems.all()
	list1=[]
	offset = int(offset);
	for each in page:
		i = 0;
		if(each.id ==offset):
	    		dict1={'prior_nodes' :[]}
    			dict1['id'] = each.id
    			dict1['name'] = each.title
			dict1['content'] = each.content
			temp = []
			prior_nodes=[]
			temp= Gbobject.objects.get(id=each.id)
			#dict1['temp'] = temp	
			#for(i=0;temp[i]!=none;i++):
			#	prior_nodes[i] = x.tags[0]
			#	i=i+1
			dict1['tags']=[]
			dict1['tags']=temp.tags.split(",")
			prior_nodes = temp.prior_nodes.all()
			for x in prior_nodes:
				#dict1['prior_nodes'].append({'id':x.id , 'title' : x.title})
				dict1['prior_nodes'].append(x.title)
			#dict1['creation_date'] = each.creation_date
    			list1.append(dict1)
	return HttpResponse(json.dumps(list1))
	#return HttpResponseRedirect("/gstudio/resources/New/"+str(offset))

def addFunc(request):
	print "insert Addfunc"
	if request.method=="GET":
		#wikiid= request.G('id','')
                wikiid=int(request.GET['id1'])
		print wikiid,"id"
		wikiid2=int(request.GET['id2'])
		print wikiid2,"id"
		
		
		#id1=int(request.POST.get['data.id1',''])
		#id2=int(request.POST.get['data.id2',''])
		#tags = int(offset.id2)
		x=System.objects.get(id=wikiid)
#		fro=int(offset.id1)
		
		y=System.objects.get(id=wikiid2)
		x.prior_nodes.add(y)
		return HttpResponse("success")

def delFunc(request):
	if request.method=="GET":
		wikiid=int(request.GET['id1'])
		print wikiid,"id"
		wikiid2=request.GET['id2']
		print wikiid2,"id"
		x=System.objects.get(id=wikiid)
		y=System.objects.get(title=wikiid2)
		x.prior_nodes.remove(y)
		return HttpResponse("success")
