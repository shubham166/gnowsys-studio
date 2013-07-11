"""Urls for the Gstudio sitemap"""
from django.conf.urls.defaults import url
from django.conf.urls.defaults import patterns

urlpatterns = patterns('gstudio.views.OxjsViews',
                       url(r'^Wikilist/$', 'Wikilist',name='oxjs_views'),
		       url(r'^LoomThread/$', 'LoomThread',name='oxjs_views'),
			url(r'^Wikidetail/(\d{1,4})/$' , 'Wikidetail', name='oxjs_views'),
			#url(r'^Wikidetail/711/$' , 'Wikidetail2', name='oxjs_views')
			url(r'^AddTag/$', 'addFunc', name='oxjs_views'),
			url(r'^delPrior/$' , 'delFunc', name='oxjs_views')
			)
