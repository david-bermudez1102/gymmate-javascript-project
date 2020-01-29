class CreateStars < ActiveRecord::Migration[5.2]
  def change
    create_table :stars do |t|
      t.references :program, foreign_key: true
      t.integer :amount

      t.timestamps
    end
  end
end
