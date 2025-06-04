// Удаляем импорт React, так как он не используется
import css from './Loader.module.css';

function Loader() {
  return <div className={css.text}>Загрузка...</div>;
}

export default Loader; 