import { supabaseRequest } from '../db/connection.js';

export const approveShramik = async (req, res) => {
  const [shramik] = await supabaseRequest('rpc/approve_shramik', {
    method: 'POST',
    body: JSON.stringify({ shramik_uuid: req.params.id }),
  });

  if (!shramik) return res.status(404).json({ error: 'Pending Shramik not found.' });
  return res.json(shramik);
};