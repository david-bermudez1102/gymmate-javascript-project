class AddAttachmentVideoToPrograms < ActiveRecord::Migration[5.2]
  def self.up
    change_table :programs do |t|
      t.attachment :video
    end
  end

  def self.down
    remove_attachment :programs, :video
  end
end
