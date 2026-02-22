import ControlPanelClient from './ControlPanelClient';

export default function ControlPanelPage() {
    // Read the secret passcode directly from the Node.js environment on the server side
    // This value is securely injected directly into the ControlPanelClient's props
    // and is never exposed to public display clients.
    const token = process.env.ADMIN_PASSCODE || '';

    return <ControlPanelClient token={token} />;
}
