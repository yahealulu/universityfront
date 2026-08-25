import { Copy, Pencil, Share2 } from 'lucide-react'
import type { FC } from 'react'
import { useCallback, useId, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import type { PatientProfile } from '@/types/patient.types'
import { buildPatientPortalShareUrl } from '@/utils/patientPortalMock'

export type PatientProfileHeaderProps = {
  patientId: string
  profile: PatientProfile
  onEdit: () => void
}

type CopyStatus = 'idle' | 'copied' | 'failed'

export const PatientProfileHeader: FC<PatientProfileHeaderProps> = ({ patientId, profile, onEdit }) => {
  const { t } = useTranslation()
  const descriptionId = useId()
  const [shareOpen, setShareOpen] = useState(false)
  const [shareUrl, setShareUrl] = useState('')
  const [copyStatus, setCopyStatus] = useState<CopyStatus>('idle')

  const writeClipboard = useCallback(async (url: string) => {
    try {
      await navigator.clipboard.writeText(url)
      setCopyStatus('copied')
    } catch {
      setCopyStatus('failed')
    }
  }, [])

  const handleShare = useCallback(() => {
    const url = buildPatientPortalShareUrl(window.location.origin, patientId, {
      name: profile.name,
      patientCode: profile.patientCode,
    })
    setShareUrl(url)
    setCopyStatus('idle')
    setShareOpen(true)
    void writeClipboard(url)
  }, [patientId, profile.name, profile.patientCode, writeClipboard])

  const handleDialogOpenChange = useCallback((open: boolean) => {
    setShareOpen(open)
    if (!open) {
      setCopyStatus('idle')
    }
  }, [])

  const handleCopyAgain = useCallback(() => {
    void writeClipboard(shareUrl)
  }, [shareUrl, writeClipboard])

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
      <div>
        <h1 className="text-2xl font-bold text-primary-navy md:text-3xl">{profile.name}</h1>
        <p className="mt-1 text-sm text-muted-foreground md:text-base">
          {t('patients.profile.idCode', { code: profile.patientCode })}
        </p>
      </div>
      <div className="flex flex-wrap gap-2">
        <Button
          type="button"
          variant="outline"
          className="gap-2 rounded-lg border-primary text-primary hover:bg-primary/5"
          onClick={onEdit}
        >
          <Pencil className="h-4 w-4" />
          {t('patients.profile.edit')}
        </Button>
        <Button type="button" className="gap-2 rounded-lg" onClick={handleShare}>
          <Share2 className="h-4 w-4" />
          {t('patients.profile.share')}
        </Button>
      </div>

      <Dialog open={shareOpen} onOpenChange={handleDialogOpenChange}>
        <DialogContent className="max-w-lg" aria-describedby={descriptionId}>
          <DialogHeader>
            <DialogTitle>{t('patients.profile.shareDialog.title')}</DialogTitle>
          </DialogHeader>
          <p id={descriptionId} className="text-sm text-muted-foreground">
            {t('patients.profile.shareDialog.description')}
          </p>
          <div className="rounded-lg border border-border-card bg-muted/30 p-3">
            <label htmlFor="patient-share-url" className="sr-only">
              {t('patients.profile.shareDialog.urlLabel')}
            </label>
            <input
              id="patient-share-url"
              readOnly
              className="w-full break-all bg-transparent text-sm text-foreground outline-none"
              value={shareUrl}
              onFocus={(e) => e.target.select()}
            />
          </div>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <Button type="button" variant="outline" className="gap-2" onClick={handleCopyAgain}>
              <Copy className="h-4 w-4" aria-hidden />
              {t('patients.profile.shareDialog.copyAgain')}
            </Button>
            <Button type="button" variant="outline" onClick={() => handleDialogOpenChange(false)}>
              {t('patients.profile.shareDialog.done')}
            </Button>
          </div>
          <p role="status" className="text-sm text-muted-foreground">
            {copyStatus === 'copied' ? t('patients.profile.shareDialog.copySuccess') : null}
            {copyStatus === 'failed' ? t('patients.profile.shareDialog.copyFailed') : null}
          </p>
        </DialogContent>
      </Dialog>
    </div>
  )
}
