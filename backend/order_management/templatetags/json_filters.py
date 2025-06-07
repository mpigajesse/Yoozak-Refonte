import json
from django import template
from decimal import Decimal
from datetime import datetime, date

register = template.Library()

class CustomJSONEncoder(json.JSONEncoder):
    def default(self, obj):
        if isinstance(obj, Decimal):
            return float(obj)
        if isinstance(obj, (datetime, date)):
            return obj.isoformat()
        return super().default(obj)

@register.filter
def to_json(value):
    """Convert Python data to JSON string"""
    return json.dumps(value, cls=CustomJSONEncoder) 