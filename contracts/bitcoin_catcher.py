OntCversion = '2.0.0'

from boa.interop.System.Runtime import Notify, CheckWitness
from boa.builtins import concat

from ontology.interop.System.Storage import Put, Get, Delete, GetContext
from ontology.interop.Ontology.Runtime import Base58ToAddress
from ontology.interop.System.Action import RegisterAction



ctx = GetContext()


USER_KEY = 'user'
SCORE_KEY = 'score'

ADMIN = Base58ToAddress("ANH5bHrrt111XwNEnuPZj6u95Dd6u7G4D6")

ZERO_ADDRESS = bytearray(
    b'\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00')

registerEvent = RegisterAction("register", "user_address", "user_name")
updateScoreEvent = RegisterAction(
    "update score", 'user_address', 'user_name', 'score')

cleanScoreEvent = RegisterAction('clean score', 'user_address', 'user_name')
cleanUserNameEvent = RegisterAction('clean user name', 'user_address')


def main(operation, args):
    if operation == 'register':
        return register(args[0], args[1])
    if operation == 'get_user_name':
        return get_user_name(args[0])
    if operation == 'update_score':
        return update_score(args[0], args[1])
    if operation == 'get_score':
        return get_score(args[0])
    if operation == 'clean_score':
        return clean_score(args)
    if operation == 'clean_user_name':
        return clean_user_name(args)
    return False


def register(user_address, user_name):
    if len(user_address) == 34:
        user_address = Base58ToAddress(user_address)
    assert (len(user_address) == 20 and user_address != ZERO_ADDRESS)

    if Get(ctx, concat(user_address, USER_KEY)):
        raise Exception("username exist")

    assert(CheckWitness(user_address))
    Put(ctx, concat(user_address, USER_KEY), user_name)
    registerEvent(user_address, user_name)
    return True


def get_user_name(user_address):
    if len(user_address) == 34:
        user_address = Base58ToAddress(user_address)
    assert (len(user_address) == 20 and user_address != ZERO_ADDRESS)

    user_name = Get(ctx, concat(user_address, USER_KEY))
    if not user_name:
        raise Exception('username not exist')
    return user_name


def update_score(user_address, score):
    if len(user_address) == 34:
        user_address = Base58ToAddress(user_address)
    assert (len(user_address) == 20 and user_address != ZERO_ADDRESS)

    user_name = Get(ctx, concat(user_address, USER_KEY))
    if not user_name:
        raise Exception("username not exist")
    assert (CheckWitness(user_address))
    Put(ctx, concat(user_address, SCORE_KEY), score)
    updateScoreEvent(user_address, user_name, score)
    return True


def get_score(user_address):
    if len(user_address) == 34:
        user_address = Base58ToAddress(user_address)
    assert (len(user_address) == 20 and user_address != ZERO_ADDRESS)

    return Get(ctx, concat(user_address, SCORE_KEY))


def clean_score(user_address):
    if len(user_address) == 34:
        user_address = Base58ToAddress(user_address)
    assert (len(user_address) == 20 and user_address != ZERO_ADDRESS)

    assert(CheckWitness(ADMIN))
    user_name = Get(ctx, concat(user_address, USER_KEY))
    if not user_name:
        raise Exception("username not exist")
    Delete(ctx, concat(user_address, SCORE_KEY))
    cleanScoreEvent(user_address, user_name)
    return True


def clean_user_name(user_address):
    if len(user_address) == 34:
        user_address = Base58ToAddress(user_address)
    assert (len(user_address) == 20 and user_address != ZERO_ADDRESS)

    assert(CheckWitness(ADMIN))
    if not Get(ctx, concat(user_address, USER_KEY)):
        raise Exception("username not exist")
    Delete(ctx, concat(user_address, USER_KEY))
    cleanUserNameEvent(user_address)
    return True
