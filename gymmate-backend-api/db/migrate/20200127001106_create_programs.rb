class CreatePrograms < ActiveRecord::Migration[5.2]
  def change
    create_table :programs do |t|
      t.string :title
      t.string :description
      t.references :trainer
      t.timestamps
    end
  end
end
