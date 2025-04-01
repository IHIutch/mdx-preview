export function InfoBox({ children }: { children: React.ReactNode }) {
  return (
    <div className="usa-alert usa-alert--info">
      <div className="usa-alert__body">
        <h4 className="usa-alert__heading">Informative status</h4>
        <p className="usa-alert__text">
          {children}
        </p>
      </div>
    </div>
  )
}
