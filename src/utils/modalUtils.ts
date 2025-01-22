  export const modalUtils = (showModal: any) => {
     return {
        showGameStartModal: (onConfirm: () => void, onFinal: () => void) => {
            showModal({
              title: "Rozpoczęcie gry",
              text: "Czy chcesz rozpocząć grę?",
              icon: 'question',
              confirmButtonText: 'Tak',
              cancelButtonText: 'Nie',
              onConfirm: () => {
                  onConfirm()
                  onFinal()
              }, 
              onCancel: () => {
                onFinal()
              },
            });
          },
          showQuizStartModal: (currPoint: number, onConfirm: () => void, onFinal: () => void) => {
            showModal({
              title: `Rozpoczęcie Etapu ${currPoint}`,
              text: "Czy chcesz rozpocząć quiz?",
              icon: 'question',
              confirmButtonText: 'Tak',
              cancelButtonText: 'Nie',
              onConfirm: () => {
                  onConfirm()
                  onFinal()
              }, 
              onCancel: () => {
                onFinal()
              },
            });
          },
          showFinishModal: (maxPoint: number, currPoint: number ,onConfirm: () => void) => {
            showModal({
              title: `Koniec Gry.`,
              text: `Twoja punktacja to ${currPoint}/${maxPoint}`,
              icon: "success",
              confirmButtonText: 'Ok',
              onConfirm: () => {
                  onConfirm()
              }
            });
          },
          errorFetchModal: (info: {title: string, text: string, icon: string, confirmText: string, confirm: () => void } ) => {
            showModal({
              title: info.title,
              text: info.text,
              icon: info.icon,
              confirmButtonText: info.confirmText,
              onConfirm: () => {
                info.confirm()
              },
            });
          }
     }
  }
