from __future__ import absolute_import, division, print_function, unicode_literals

import unittest

import _support  # noqa: F401
from otmetki.core.native_settings import (
    ACTION_RECOMMENDED,
    ACTION_RESTORE,
    NATIVE,
    STEP_APPLY,
    STEP_NATIVE,
    TRI_STATE,
    NativeState,
    client_keys,
    is_recommended,
    native_choices,
    offered_action,
    recommended,
)
from otmetki.core.settings import Schema

SCHEMA = Schema(
    {'preset': 'minimal', 'server_reticle': NATIVE, 'mark': 'none', 'size': 48},
    choices={
        'preset': (NATIVE, 'classic', 'minimal'),
        'server_reticle': TRI_STATE,
        'mark': ('none', 'dot'),
    },
)


class ClientKeysTest(unittest.TestCase):

    def test_client_keys_are_the_choices_that_offer_native(self):
        assert client_keys(SCHEMA) == ('preset', 'server_reticle')

    def test_recommended_values_are_the_schema_defaults(self):
        assert recommended(SCHEMA, ('preset', 'server_reticle')) == {'preset': 'minimal', 'server_reticle': NATIVE}

    def test_native_choices_leave_every_key_to_the_game(self):
        assert native_choices(('preset', 'server_reticle')) == {'preset': NATIVE, 'server_reticle': NATIVE}

    def test_the_defaults_are_recommended(self):
        values = {'preset': 'minimal', 'server_reticle': NATIVE, 'mark': 'dot'}

        assert is_recommended(values, SCHEMA, ('preset', 'server_reticle')) is True

    def test_a_native_preset_is_not_recommended(self):
        values = {'preset': NATIVE, 'server_reticle': NATIVE}

        assert is_recommended(values, SCHEMA, ('preset', 'server_reticle')) is False


class OfferedActionTest(unittest.TestCase):

    def test_a_backup_offers_the_restore(self):
        assert offered_action(True, True) == ACTION_RESTORE

    def test_values_off_the_recommendation_offer_it(self):
        assert offered_action(False, False) == ACTION_RECOMMENDED

    def test_recommended_values_without_a_backup_offer_nothing(self):
        assert offered_action(False, True) is None


class EnrollTest(unittest.TestCase):

    def test_a_fresh_install_makes_the_component_due(self):
        state = NativeState()

        state.enroll('camera', fresh_install=True)

        assert state.is_due('camera') is True

    def test_an_existing_install_is_never_due(self):
        state = NativeState()

        state.enroll('camera', fresh_install=False)

        assert state.is_due('camera') is False

    def test_enrolling_reports_a_new_component(self):
        assert NativeState().enroll('camera', fresh_install=True) is True

    def test_a_stamped_component_is_not_enrolled_again(self):
        state = NativeState(stamps={'camera': 3})

        enrolled = state.enroll('camera', fresh_install=True)

        assert enrolled is False
        assert state.is_due('camera') is False

    def test_a_pending_stamp_survives_a_restart(self):
        state = NativeState(stamps=NativeState(stamps={'camera': 0}).dump_stamps())

        state.enroll('camera', fresh_install=False)

        assert state.is_due('camera') is True


class HangarStepTest(unittest.TestCase):

    def due_state(self):
        state = NativeState()
        state.enroll('minimap', fresh_install=True)
        return state

    def test_a_due_component_with_its_switch_on_applies(self):
        assert self.due_state().hangar_step('minimap', True) == STEP_APPLY

    def test_a_due_component_with_its_switch_off_goes_native(self):
        assert self.due_state().hangar_step('minimap', False) == STEP_NATIVE

    def test_a_settled_component_does_nothing(self):
        state = self.due_state()

        state.settle('minimap')

        assert state.hangar_step('minimap', True) is None

    def test_settling_stamps_the_revision(self):
        state = self.due_state()

        state.settle('minimap')

        assert state.dump_stamps() == {'minimap': 3}


class BackupTest(unittest.TestCase):

    def test_a_kept_backup_reads_back(self):
        state = NativeState()

        state.keep('minimap', {'minimapViewRange': False}, {'minimapSize': 2})

        assert state.backup('minimap') == ({'minimapViewRange': False}, {'minimapSize': 2})

    def test_a_backup_is_stored_per_component(self):
        state = NativeState()

        state.keep('camera', {'dynamicCamera': True}, {})

        assert state.dump_backups() == {'camera': {'settings': {'dynamicCamera': True}, 'account': {}}}

    def test_a_dropped_backup_is_gone(self):
        state = NativeState(backups={'camera': {'settings': {'dynamicCamera': True}, 'account': {}}})

        state.drop('camera')

        assert state.backup('camera') is None

    def test_a_damaged_backup_reads_as_none(self):
        assert NativeState(backups={'camera': 'x'}).backup('camera') is None

    def test_damaged_state_starts_empty(self):
        state = NativeState(backups=[1], stamps='x')

        assert state.dump_backups() == {}
        assert state.dump_stamps() == {}
