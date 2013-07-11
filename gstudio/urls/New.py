from django.conf.urls import patterns
from django.views.generic import TemplateView

urlpatterns = patterns('',
    (r'^$', TemplateView.as_view(template_name="OxJS/index.html")),
#    (r'^(\d+)/$', Column_View (template_name="OxJS/Column.html")),
)
