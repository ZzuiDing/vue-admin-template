export async function uploadToOSS(file) {
  if (!file) {
    throw new Error('请选择文件后再上传')
  }

  // 生成随机文件名
  const getHashedFilename = async(file) => {
    const fileBuffer = await file.arrayBuffer()
    const hashBuffer = await crypto.subtle.digest('SHA-256', fileBuffer)
    const hashArray = Array.from(new Uint8Array(hashBuffer))
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
    const randomString = Math.random().toString(36).substr(2, 8)
    const fileExt = file.name.split('.').pop()
    return `${randomString}_${hashHex}.${fileExt}`
  }

  const filename = await getHashedFilename(file)

  // 获取 OSS 上传签名
  const response = await fetch('http://localhost:9090/spba-api/get_post_signature_for_oss_upload')
  if (!response.ok) {
    throw new Error('获取 OSS 签名失败')
  }
  const data = await response.json()

  // 组装 FormData
  const formData = new FormData()
  formData.append('success_action_status', '200')
  formData.append('policy', data.policy)
  formData.append('x-oss-signature', data.signature)
  formData.append('x-oss-signature-version', 'OSS4-HMAC-SHA256')
  formData.append('x-oss-credential', data.x_oss_credential)
  formData.append('x-oss-date', data.x_oss_date)
  formData.append('key', data.dir + filename)
  formData.append('x-oss-security-token', data.security_token)
  formData.append('file', file)

  // 上传到 OSS
  const uploadResponse = await fetch(`https://${data.host}`, {
    method: 'POST',
    body: formData
  })

  if (!uploadResponse.ok) {
    throw new Error('文件上传失败')
  }

  // 返回 OSS 文件 URL
  return `https://skyaccesss.oss-cn-beijing.aliyuncs.com/${data.dir}${filename}`
}
