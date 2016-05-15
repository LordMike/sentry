from __future__ import absolute_import

import urllib
import logging
import requests

from sentry import options


logger = logging.getLogger(__name__)


def sms_available():
    return bool(options.get('sms.twilio_account'))


def send_sms(body, to, from_=None):
    account = options.get('sms.twilio_account')
    if not account:
        raise RuntimeError('SMS backend is not configured.')
    if account[:2] != 'AC':
        account = 'AC' + account
    url = 'https://api.twilio.com/2010-04-01/Accounts/%s/Messages.json' % \
        urllib.quote(account)
    rv = requests.post(url, auth=(account,
                             options.get('sms.twilio_token')), data={
        'To': to,
        'From': options.get('sms.twilio_number'),
        'Body': body,
    })
    if not rv.ok:
        logging.exception('Failed to send text message to %s: (%s) %s', to,
                          rv.status_code, rv.content)
        return False
    return True