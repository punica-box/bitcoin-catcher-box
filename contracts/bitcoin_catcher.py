OntCversion = '2.0.0'

from boa.builtins import concat
from boa.interop.System.Runtime import Notify, CheckWitness

from ontology.interop.System.Action import RegisterAction
from ontology.interop.System.Storage import Put, Get, GetContext


ctx = GetContext()


USER_KEY = 'user'
SCORE_KEY = 'score'

registerEvent = RegisterAction("register", "user_address", "user_name")
updateScoreEvent = RegisterAction(
    "updateScore", 'user_address', 'user_name', 'score')


def main(operation, args):
    if operation == 'register':
        return register(args[0], args[1])
    elif operation == 'update_score':
        return update_score(args[0], args[1])
    elif operation == 'get_score':
        return get_score(args[0])
    return False


def register(user_address, user_name):
    if Get(ctx, concat(user_name, USER_KEY)):
        raise Exception("username exist")
    assert (CheckWitness(user_address))
    Put(ctx, concat(user_name, USER_KEY), user_address)
    registerEvent(user_address, user_name)
    return True


def update_score(user_name, score):
    user_address = Get(ctx, concat(user_name, USER_KEY))
    if not user_address:
        raise Exception("username not exist")
    assert (CheckWitness(user_address))
    Put(ctx, concat(user_name, SCORE_KEY), score)
    updateScoreEvent(user_address, user_name, score)
    return True


def get_score(user_name):
    return Get(ctx, concat(user_name, SCORE_KEY))
