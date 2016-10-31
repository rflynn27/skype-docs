/// <reference path="../../../framework.d.ts" />
(function () {
    'use strict';

    const content = window.framework.findContentDiv();
    (<HTMLElement>content.querySelector('.notification-bar')).style.display = 'none';

    const mdFileUrl: string = window.framework.getContentLocation() === '' ? '../../../docs/ManageDevices.md' : 'Content/websdk/docs/ManageDevices.md';
    content.querySelector('zero-md').setAttribute('file', mdFileUrl);

    function addDevice(device, id) {
        device.name.changed(value => {
            const option = document.createElement('option');
            option.value = value;
            option.innerHTML = value;
            content.querySelector('#' + id + 'sSelect').appendChild(option);
        });
    }

    function selectDevice(device, id) {
        if (device) {
            (<HTMLOptionElement>content.querySelector('#' + id + 'sSelect')).value = device.name();
            window.framework.updateNotification('info', id + ' loading done');
        }
    }

    window.framework.updateNotification('info', 'Retrieving device info...');

    const devicesManager = window.framework.application.devicesManager;

    devicesManager.speakers.subscribe();
    devicesManager.speakers.added(speaker => addDevice(speaker, 'speaker'));
    devicesManager.selectedSpeaker.changed(speaker => selectDevice(speaker, 'speaker'));

    devicesManager.microphones.subscribe();
    devicesManager.microphones.added(microphone => addDevice(microphone, 'microphone'));
    devicesManager.selectedMicrophone.changed(microphone => selectDevice(microphone, 'microphone'));

    devicesManager.cameras.subscribe();
    devicesManager.cameras.added(camera => addDevice(camera, 'camera'));
    devicesManager.selectedCamera.changed(camera => selectDevice(camera, 'camera'));

    window.framework.addEventListener(content.querySelector('#set-speaker'), 'click', () => {
        setDevice(devicesManager.speakers, devicesManager.selectedSpeaker, (<HTMLOptionElement>content.querySelector('#speakersSelect Option:checked')).value);
    });
    window.framework.addEventListener(content.querySelector('#set-microphone'), 'click', () => {
        setDevice(devicesManager.microphones, devicesManager.selectedMicrophone, (<HTMLOptionElement>content.querySelector('#microphonesSelect option:checked')).value);
    });
    window.framework.addEventListener(content.querySelector('#set-camera'), 'click', () => {
        setDevice(devicesManager.cameras, devicesManager.selectedCamera, (<HTMLOptionElement>content.querySelector('#camerasSelect option:checked')).value);
    });

    function setDevice(devices, device, option) {
        const filteredDevices = devices.filter(d => d.name() == option);
        if (filteredDevices.size() > 0) {
            device.set(filteredDevices(0)).then(() => {
                window.framework.updateNotification('success', 'Set selected device');
            }).catch(error => {
                window.framework.updateNotification('error', error);
            });
        }
    }
})();
